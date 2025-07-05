import { updateMovie } from "@/app/server-actions/movies/update-movie";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/utils/is-user-admin";
import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";

// Mocks
jest.mock("@/utils/is-user-admin", () => ({
  isAdmin: jest.fn(),
}));

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("@prisma/client", () => {
  const mockClient = {
    movies: {
      update: jest.fn(),
    },
    movies_directors: {
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
    movies_countries: {
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
    movies_genres: {
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
    movies_keywords: {
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
    $disconnect: jest.fn(),
  };

  return {
    PrismaClient: jest.fn(() => mockClient),
  };
});

describe("updateMovie", () => {
  let mockPrismaClient: any;

  // Réinitialiser les mocks avant chaque test
  beforeEach(() => {
    jest.clearAllMocks();
    mockPrismaClient = new PrismaClient();
  });

  it("devrait retourner une erreur si l'utilisateur n'est pas admin", async () => {
    // Mock isAdmin pour retourner false
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const formData = new FormData();

    const result = await updateMovie(formData);

    expect(result).toEqual({
      type: "error",
      message: "You must be admin to update a movie",
    });
    expect(isAdmin).toHaveBeenCalled();
  });

  it("devrait mettre à jour un film avec succès sans upload d'image", async () => {
    // Mock isAdmin pour retourner true
    (isAdmin as jest.Mock).mockResolvedValue(true);

    // Créer des données de formulaire valides
    const formData = new FormData();
    formData.append("id", "123");
    formData.append("title", "Updated Movie Title");
    formData.append("description", "Updated description");
    formData.append("release_date", "2024");
    formData.append("language", "fr");
    formData.append("type", "feature");
    formData.append("runtime", "130");
    formData.append("image_url", "existing-image.jpg");
    formData.append("director_ids", JSON.stringify(["1", "2"]));
    formData.append("country_id", "1");
    formData.append("genre_ids", JSON.stringify(["1", "3"]));
    formData.append("keyword_ids", JSON.stringify(["2", "4"]));

    // Mock des fonctions Prisma pour être résolues
    mockPrismaClient.movies.update.mockResolvedValue({
      id: "123",
      title: "Updated Movie Title",
    });

    const result = await updateMovie(formData);

    // Vérifier que les fonctions ont été appelées
    expect(isAdmin).toHaveBeenCalled();
    expect(mockPrismaClient.movies.update).toHaveBeenCalledWith({
      where: { id: "123" },
      data: expect.objectContaining({
        title: "Updated Movie Title",
        description: "Updated description",
        release_date: "2024",
        language: "fr",
        type: "feature",
        runtime: 130,
        image_url: "existing-image.jpg",
      }),
    });

    // Vérifier que les relations ont été mises à jour
    expect(mockPrismaClient.movies_directors.deleteMany).toHaveBeenCalledWith({
      where: { movie_id: "123" },
    });
    expect(mockPrismaClient.movies_directors.create).toHaveBeenCalledTimes(2);

    expect(mockPrismaClient.movies_countries.deleteMany).toHaveBeenCalledWith({
      where: { movie_id: "123" },
    });
    expect(mockPrismaClient.movies_countries.create).toHaveBeenCalledWith({
      data: { movie_id: "123", country_id: 1 },
    });

    expect(mockPrismaClient.movies_genres.deleteMany).toHaveBeenCalledWith({
      where: { movie_id: "123" },
    });
    expect(mockPrismaClient.movies_genres.create).toHaveBeenCalledTimes(2);

    expect(mockPrismaClient.movies_keywords.deleteMany).toHaveBeenCalledWith({
      where: { movie_id: "123" },
    });
    expect(mockPrismaClient.movies_keywords.create).toHaveBeenCalledTimes(2);

    expect(revalidatePath).toHaveBeenCalledWith("/movies/123");
    expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it("devrait mettre à jour un film avec upload d'image", async () => {
    // Mock isAdmin pour retourner true
    (isAdmin as jest.Mock).mockResolvedValue(true);

    // Mock Supabase storage upload
    const mockSupabase = {
      storage: {
        from: jest.fn().mockReturnValue({
          upload: jest.fn().mockResolvedValue({
            data: { path: "new-image-path.jpg" },
            error: null,
          }),
        }),
      },
    };
    (createClient as jest.Mock).mockReturnValue(mockSupabase);

    // Créer des données de formulaire valides avec une nouvelle image
    const formData = new FormData();
    const mockFile = new File(["dummy content"], "newimage.jpg", {
      type: "image/jpeg",
    });

    formData.append("id", "123");
    formData.append("title", "Updated Movie Title");
    formData.append("description", "Updated description");
    formData.append("release_date", "2024");
    formData.append("language", "fr");
    formData.append("type", "feature");
    formData.append("runtime", "130");
    formData.append("image_url", "existing-image.jpg");
    formData.append("image", mockFile);
    formData.append("director_ids", JSON.stringify(["1"]));
    formData.append("country_id", "1");
    formData.append("genre_ids", JSON.stringify(["1"]));
    formData.append("keyword_ids", JSON.stringify(["2"]));

    // Mock des fonctions Prisma pour être résolues
    mockPrismaClient.movies.update.mockResolvedValue({
      id: "123",
      title: "Updated Movie Title",
    });

    const result = await updateMovie(formData);

    // Vérifier que Supabase a été appelé pour l'upload
    expect(createClient).toHaveBeenCalled();
    expect(mockSupabase.storage.from).toHaveBeenCalledWith("storage");
    expect(mockSupabase.storage.from().upload).toHaveBeenCalledWith(
      expect.stringContaining("newimage.jpg"),
      mockFile,
      { cacheControl: "3600", upsert: true }
    );

    // Vérifier que l'URL de l'image mise à jour est utilisée
    expect(mockPrismaClient.movies.update).toHaveBeenCalledWith({
      where: { id: "123" },
      data: expect.objectContaining({
        image_url: "new-image-path.jpg",
      }),
    });

    expect(result).toEqual({ success: true });
  });

  it("devrait gérer l'erreur lors du téléchargement de l'image", async () => {
    // Mock isAdmin pour retourner true
    (isAdmin as jest.Mock).mockResolvedValue(true);

    // Mock Supabase storage upload avec une erreur
    const mockSupabase = {
      storage: {
        from: jest.fn().mockReturnValue({
          upload: jest.fn().mockResolvedValue({
            data: null,
            error: new Error("Upload failed"),
          }),
        }),
      },
    };
    (createClient as jest.Mock).mockReturnValue(mockSupabase);

    // Créer des données de formulaire valides avec une nouvelle image
    const formData = new FormData();
    const mockFile = new File(["dummy content"], "newimage.jpg", {
      type: "image/jpeg",
    });

    formData.append("id", "123");
    formData.append("title", "Updated Movie Title");
    formData.append("description", "Updated description");
    formData.append("release_date", "2024");
    formData.append("language", "fr");
    formData.append("type", "feature");
    formData.append("runtime", "130");
    formData.append("image_url", "existing-image.jpg");
    formData.append("image", mockFile);
    formData.append("director_ids", JSON.stringify(["1"]));
    formData.append("country_id", "1");
    formData.append("genre_ids", JSON.stringify(["1"]));
    formData.append("keyword_ids", JSON.stringify(["2"]));

    const result = await updateMovie(formData);

    expect(result).toEqual({
      success: false,
      error: "Upload failed",
    });
  });

  it("devrait gérer les erreurs de base de données", async () => {
    // Mock isAdmin pour retourner true
    (isAdmin as jest.Mock).mockResolvedValue(true);

    // Créer des données de formulaire valides
    const formData = new FormData();
    formData.append("id", "123");
    formData.append("title", "Updated Movie Title");
    formData.append("description", "Updated description");
    formData.append("release_date", "2024");
    formData.append("language", "fr");
    formData.append("type", "feature");
    formData.append("runtime", "130");
    formData.append("image_url", "existing-image.jpg");
    formData.append("director_ids", JSON.stringify(["1"]));
    formData.append("country_id", "1");
    formData.append("genre_ids", JSON.stringify(["1"]));
    formData.append("keyword_ids", JSON.stringify(["2"]));

    // Mock d'une erreur lors de la mise à jour
    const dbError = new Error("Database error");
    mockPrismaClient.movies.update.mockRejectedValue(dbError);

    const result = await updateMovie(formData);

    expect(result).toEqual({
      success: false,
      error: "Database error",
    });
    expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
  });
});
