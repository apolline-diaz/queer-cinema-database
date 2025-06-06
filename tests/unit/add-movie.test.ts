import { addMovie } from "@/app/server-actions/movies/add-movie";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/utils/is-user-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Mocks
jest.mock("@/utils/is-user-admin", () => ({
  isAdmin: jest.fn(),
}));

jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: jest.fn(),
    directors: {
      upsert: jest.fn(),
    },
    movies: {
      create: jest.fn(),
    },
    movies_countries: {
      createMany: jest.fn(),
    },
    movies_directors: {
      create: jest.fn(),
    },
    movies_genres: {
      createMany: jest.fn(),
    },
    movies_keywords: {
      createMany: jest.fn(),
    },
  },
}));

describe("addMovie", () => {
  // Réinitialiser les mocks avant chaque test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("devrait retourner une erreur si l'utilisateur n'est pas admin", async () => {
    // Mock isAdmin pour retourner false
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const formData = new FormData();

    const result = await addMovie(formData);

    expect(result).toEqual({
      type: "error",
      message: "You must be admin to update a movie",
      errors: null,
    });
    expect(isAdmin).toHaveBeenCalled();
  });

  it("devrait valider les données du formulaire et retourner une erreur si invalides", async () => {
    // Mock isAdmin pour retourner true
    (isAdmin as jest.Mock).mockResolvedValue(true);

    const formData = new FormData();
    formData.append("title", ""); // Titre vide, ce qui devrait échouer à la validation

    const result = await addMovie(formData);

    expect(result.type).toBe("error");
    expect(result.errors).toBeDefined();
    expect(result.message).toBe(
      "Veuillez remplir tous les champs obligatoires"
    );
  });

  it("devrait ajouter un film avec succès", async () => {
    // Mock isAdmin pour retourner true
    (isAdmin as jest.Mock).mockResolvedValue(true);

    // Mock Supabase storage upload
    const mockSupabase = {
      storage: {
        from: jest.fn().mockReturnValue({
          upload: jest.fn().mockResolvedValue({
            data: { path: "path/to/image.jpg" },
            error: null,
          }),
        }),
      },
    };
    (createClient as jest.Mock).mockReturnValue(mockSupabase);

    // Mock Prisma transaction
    const mockMovie = { id: 1, title: "Test Movie" };
    const mockDirector = { id: 1, name: "Test Director" };

    (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
      // Mock les fonctions de Prisma pour le callback
      (prisma.directors.upsert as jest.Mock).mockResolvedValue(mockDirector);
      (prisma.movies.create as jest.Mock).mockResolvedValue(mockMovie);
      (prisma.movies_countries.createMany as jest.Mock).mockResolvedValue({
        count: 1,
      });
      (prisma.movies_directors.create as jest.Mock).mockResolvedValue({
        id: 1,
      });
      (prisma.movies_genres.createMany as jest.Mock).mockResolvedValue({
        count: 1,
      });
      (prisma.movies_keywords.createMany as jest.Mock).mockResolvedValue({
        count: 1,
      });

      return await callback(prisma);
    });

    // Créer des données de formulaire valides
    const formData = new FormData();
    const mockFile = new File(["dummy content"], "test.jpg", {
      type: "image/jpeg",
    });

    formData.append("title", "Test Movie");
    formData.append("original_title", "Test Original Movie");
    formData.append("director_name", "Test Director");
    formData.append("description", "Test description for the movie");
    formData.append("release_date", "2023");
    formData.append("runtime", "120");
    formData.append("country_id", "1");
    formData.append("genre_id", "2");
    formData.append("type", "feature");
    formData.append("keyword_id", "3,4");
    formData.append("image_url", mockFile);

    await addMovie(formData);

    // Vérifier que les fonctions ont été appelées
    expect(isAdmin).toHaveBeenCalled();
    expect(createClient).toHaveBeenCalled();
    expect(mockSupabase.storage.from).toHaveBeenCalledWith("storage");
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(redirect).toHaveBeenCalledWith("/");
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

    // Créer des données de formulaire valides
    const formData = new FormData();
    const mockFile = new File(["dummy content"], "test.jpg", {
      type: "image/jpeg",
    });

    formData.append("title", "Test Movie");
    formData.append("original_title", "Test Original Movie");
    formData.append("director_name", "Test Director");
    formData.append("description", "Test description for the movie");
    formData.append("release_date", "2023");
    formData.append("runtime", "120");
    formData.append("country_id", "1");
    formData.append("genre_id", "2");
    formData.append("type", "feature");
    formData.append("keyword_id", "3,4");
    formData.append("image_url", mockFile);

    const result = await addMovie(formData);

    expect(result).toEqual({
      type: "error",
      message:
        "Erreur avec la base de données : Echec du téléchargement de l'image",
    });
  });

  it("devrait gérer les erreurs de base de données", async () => {
    // Mock isAdmin pour retourner true
    (isAdmin as jest.Mock).mockResolvedValue(true);

    // Mock Supabase storage upload
    const mockSupabase = {
      storage: {
        from: jest.fn().mockReturnValue({
          upload: jest.fn().mockResolvedValue({
            data: { path: "path/to/image.jpg" },
            error: null,
          }),
        }),
      },
    };
    (createClient as jest.Mock).mockReturnValue(mockSupabase);

    // Mock Prisma transaction pour qu'il lance une erreur
    (prisma.$transaction as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    // Créer des données de formulaire valides
    const formData = new FormData();
    const mockFile = new File(["dummy content"], "test.jpg", {
      type: "image/jpeg",
    });

    formData.append("title", "Test Movie");
    formData.append("original_title", "Test Original Movie");
    formData.append("director_name", "Test Director");
    formData.append("description", "Test description for the movie");
    formData.append("release_date", "2023");
    formData.append("runtime", "120");
    formData.append("country_id", "1");
    formData.append("genre_id", "2");
    formData.append("type", "feature");
    formData.append("keyword_id", "3,4");
    formData.append("image_url", mockFile);

    const result = await addMovie(formData);

    expect(result).toEqual({
      type: "error",
      message: "Erreur avec la base de données : Echec de l'ajout du film",
    });
  });
});
