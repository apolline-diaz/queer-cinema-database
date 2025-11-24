"use client";

const imageUrl =
  "https://xcwrhyjbfgzsaslstssc.supabase.co/storage/v1/object/public/storage/1758151183587-watermelonwomanvideoclub.webp";

export default function Hero() {
  return (
    <>
      <div className="relative bg-rose-50 w-full overflow-hidden">
        <div
          className="relative w-full h-[80vh] overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="mt-20 absolute inset-0 flex flex-col justify-center items-left pl-10 gap-y-8">
            <div className="relative w-2/3 sm:text-7xl lg:text-8xl text-5xl">
              <h2 className="text-left font-bold">
                <span className="text-white uppercase mt-2">
                  Films & Archives{" "}
                </span>
                {/* <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 via-green-400 via-blue-500 to-violet-500"> */}
                <span className="text-transparent font-bold bg-clip-text bg-gradient-to-r from-rose-500  via-blue-500  to-yellow-400">
                  LGBTQI+
                </span>
              </h2>
            </div>
            {/* Barre de recherche qui redirige vers /movies */}
            {/* <div className="z-10 flex flex-col sm:flex-row gap-5 justify-start items-start">
              <Link
                href="/movies"
                className="relative flex flex-row gap-1 font-semibold items-center  bg-gradient-to-r from-rose-600 to-pink-600  hover:from-rose-700 hover:to-pink-700                             transition-all duration-500 ease-in-out hover:text-white                       px-3 py-2 rounded-lg text-sm"
              >
                Découvrir tous les films
                <Icon icon="uis:angle-right" fontSize={25} />
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
