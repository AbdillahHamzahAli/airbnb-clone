import Image from "next/image";
import { useCountries } from "../lib/getCountries";
import Link from "next/link";
import { AddToFavoriteButton, DeleteFromFavoriteButton } from "./SubmitButtons";
import { addToFavorite, deleteFromFavorite } from "../actions";

interface iAppProps {
  imagePath: string;
  description: string;
  location: string;
  price: number;
  userId: string | undefined;
  isInFavoriteList: boolean;
  favoriteId: string;
  homeId: string;
  pathName: string;
}

export function ListingCard({
  description,
  imagePath,
  location,
  price,
  userId,
  isInFavoriteList,
  favoriteId,
  homeId,
  pathName,
}: iAppProps) {
  const { getCountryByValue } = useCountries();
  const country = getCountryByValue(location);
  return (
    <div className="flex flex-col">
      <div className="relative h-72">
        <Image
          alt="Image of House"
          src={`https://gdbswrgesopmdocfwktn.supabase.co/storage/v1/object/public/images/${imagePath}`}
          fill
          className="rounded-lg h-full object-cover mb-3"
        />
        {userId && (
          <div className="absolute top-2 right-2 z-10">
            {isInFavoriteList ? (
              <form action={deleteFromFavorite}>
                <input type="hidden" name="favoriteId" value={favoriteId} />
                <input type="hidden" name="userId" value={userId} />
                <input type="hidden" name="pathName" value={pathName} />

                <DeleteFromFavoriteButton />
              </form>
            ) : (
              <form action={addToFavorite}>
                <input type="hidden" name="homeId" value={homeId} />
                <input type="hidden" name="userId" value={userId} />
                <input type="hidden" name="pathName" value={pathName} />

                <AddToFavoriteButton />
              </form>
            )}
          </div>
        )}
      </div>
      <Link href={"/"}>
        <h3 className="font-medium text-base mt-2">
          {country?.flag} {country?.label} / {country?.region}
        </h3>
        <p className="text-muted-foreground line-clamp-2 text-sm m">
          {description}
        </p>
        <p className="pt-2 text-muted-foreground">
          <span className="font-medium text-black">{price}</span> Night
        </p>
      </Link>
    </div>
  );
}
