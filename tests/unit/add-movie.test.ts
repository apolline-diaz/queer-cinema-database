import { addMovie } from "@/app/server-actions/movies/add-movie";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/utils/is-user-admin";

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

jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("@/utils/is-user-admin", () => ({
  isAdmin: jest.fn(),
}));

describe("addMovie", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error if the user is not an admin", async () => {
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const formData = new FormData();
    formData.append("title", "Inception");

    const result = await addMovie(formData);

    expect(result).toEqual({
      type: "error",
      message: "You must be admin to update a movie",
      errors: null,
    });
  });

  it("should validate form data and return errors if validation fails", async () => {
    (isAdmin as jest.Mock).mockResolvedValue(true);

    const formData = new FormData();
    formData.append("title", "");

    const result = await addMovie(formData);

    expect(result.type).toBe("error");
    expect(result.message).toBe(
      "Veuillez remplir tous les champs obligatoires"
    );
    expect(result.errors).toHaveProperty("title");
  });

  it("should upload the image to Supabase and create movie entries in the database", async () => {
    (isAdmin as jest.Mock).mockResolvedValue(true);

    const mockUpload = jest.fn().mockResolvedValue({
      data: { path: "path/to/image.png" },
      error: null,
    });

    (createClient as jest.Mock).mockReturnValue({
      storage: {
        from: () => ({ upload: mockUpload }),
      },
    });

    const formData = new FormData();
    formData.append("title", "Inception");
    formData.append("director_name", "Christopher Nolan");
    formData.append("description", "A mind-bending thriller");
    formData.append("release_date", "2010");
    formData.append("runtime", "148");
    formData.append("country_id", "1,2");
    formData.append("genre_id", "3");
    formData.append("type", "Long-métrage");
    formData.append(
      "image_url",
      new File(["test"], "image.png", { type: "image/png" })
    );

    await addMovie(formData);

    expect(mockUpload).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(File),
      expect.any(Object)
    );
    expect(prisma.directors.upsert).toHaveBeenCalled();
    expect(prisma.movies.create).toHaveBeenCalled();
    expect(prisma.movies_countries.createMany).toHaveBeenCalled();
    expect(prisma.movies_directors.create).toHaveBeenCalled();
    expect(prisma.movies_genres.createMany).toHaveBeenCalled();
  });
});
