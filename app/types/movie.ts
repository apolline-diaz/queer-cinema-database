import { Director } from "./director";
import { Genre } from "./genre";
import { Keyword } from "./keyword";
import { Country } from "./country";
import { Decimal } from "@prisma/client/runtime/library";

export type Movie = {
  id: string;
  title: string;
  description?: string | null;
  release_date: string | null;
  language?: string | null;
  runtime?: Decimal | null;
  image_url?: string | null;
  director?: string | null;
  country?: string | null;
  genres?: Genre[];
  keywords?: Keyword[];
  directors?: Director[];
  countries?: Country[];
};
