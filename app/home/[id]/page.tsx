/* eslint-disable @next/next/no-img-element */
import { createReservation } from "@/app/actions";
import { CategoryShowCase } from "@/app/components/CategoryShowCase";
import { HomeMap } from "@/app/components/HomeMap";
import { SelectCalender } from "@/app/components/SelectCalender";
import { ReservationSubmitutton } from "@/app/components/SubmitButtons";
import prisma from "@/app/lib/db";
import { useCountries } from "@/app/lib/getCountries";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

async function getData(homeId: string) {
  noStore();
  const data = await prisma.home.findUnique({
    where: {
      id: homeId,
    },
    select: {
      photo: true,
      description: true,
      price: true,
      bathrooms: true,
      bedrooms: true,
      title: true,
      categoryName: true,
      guests: true,
      country: true,
      Reservation: {
        where: {
          HomeId: homeId,
        },
      },
      User: {
        select: {
          profileImage: true,
          firstName: true,
        },
      },
    },
  });
  return data;
}

export default async function HomeRoute({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const data = await getData(params.id as string);
  const { getCountryByValue } = useCountries();
  const country = getCountryByValue(data?.country as string);
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <div className="w-[75%] mx-auto mt-10 mb-12">
      <h1 className="text-2xl font-medium mb-5">{data?.title}</h1>
      <div className="relative h-[550px]">
        <Image
          alt="image of home"
          src={`https://gdbswrgesopmdocfwktn.supabase.co/storage/v1/object/public/images/${data?.photo}`}
          fill
          className="rounded-lg h-full w-full object-cover"
        />
      </div>
      <div className="flex justify-between gap-x-24 mt-8 ">
        <div className="w-2/3">
          <h3 className="text-xl font-medium">
            {country?.flag} {country?.label} / {country?.region}
          </h3>
          <div className="flex gap-x-3 text-muted-foreground">
            <p>{data?.guests} Guest</p> * <p>{data?.bedrooms} Bedrooms</p> *
            <p>{data?.bathrooms} Bathrooms</p>
          </div>

          <div className="flex items-center mt-6">
            <img
              src={
                data?.User?.profileImage ??
                "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              alt="profile image"
              className="w-11 h-11 rounded-full"
            />
            <div className="flex flex-col ml-4">
              <h3 className="font-medium">Hosted by {data?.User?.firstName}</h3>
              <p className="text-sm text-muted-foreground ">Host Since 2019</p>
            </div>
          </div>

          <Separator className="my-7" />
          <CategoryShowCase categoryName={data?.categoryName as string} />
          <Separator className="my-7" />
          <p className="text-muted-foreground">{data?.description}</p>
          <Separator className="my-7" />
          <HomeMap locationValue={country?.value as string} />
        </div>

        <form action={createReservation}>
          <input type="hidden" name="homeId" value={params.id} />
          <input type="hidden" name="userId" value={user?.id} />
          <SelectCalender reservation={data?.Reservation} />
          {user?.id ? (
            <ReservationSubmitutton />
          ) : (
            <Button className="w-full" asChild>
              <Link href="/api/auth/login">Create Reservation</Link>
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
