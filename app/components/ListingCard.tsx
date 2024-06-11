import Image from "next/image";
import { useCountries } from "../lib/getCountries";
import Link from "next/link";

interface iAppProps {
  imagePath: string;
  description: string;
  location: string;
  price: number;
}

export function ListingCard({
  description,
  imagePath,
  location,
  price,
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
