import { Director } from "./director";
import { Genre } from "./genre";
import { Keyword } from "./keyword";
import { Country } from "./country";
import { Decimal } from "@prisma/client/runtime/library";

export type Movie = {
  id: string;
  title: string;
  description?: string;
  releaseDate?: string;
  language?: string;
  runtime?: Decimal;
  imageUrl?: string;
  boost?: boolean;
  genres?: Genre[];
  keywords?: Keyword[];
  directors?: Director[];
  countries?: Country[];
  createdAt?: Date;
  udpatedAt?: Date;
};
