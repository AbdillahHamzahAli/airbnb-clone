import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ListingCard } from "../components/ListingCard";
import { NoItems } from "../components/NoItems";
import prisma from "../lib/db";
import { redirect } from "next/navigation";

async function getData(userId: string) {
  const data = await prisma.reservation.findMany({
    where: {
      UserId: userId,
    },
    select: {
      Home: {
        select: {
          photo: true,
          id: true,
          description: true,
          price: true,
          country: true,
          Favorite: {
            where: {
              UserId: userId,
            },
          },
        },
      },
    },
  });

  return data;
}

export default async function ReservationsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return redirect("/");
  const data = await getData(user?.id);

  return (
    <section className="container mx-auto px-5 lg:px-10 mt-10">
      <h2 className="text-3xl font-semibold tracking-tight transition-colors">
        Your Reservations
      </h2>

      {data.length === 0 ? (
        <NoItems
          title="Hey, You dont have any Reservations"
          description="Please add Reservations to see them right here..."
        />
      ) : (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8 mt-8">
          {data.map((item) => (
            <ListingCard
              key={item.Home?.id}
              imagePath={item.Home?.photo as string}
              description={item.Home?.description as string}
              price={item.Home?.price as number}
              location={item.Home?.country as string}
              userId={user?.id as string}
              homeId={item.Home?.id as string}
              favoriteId={item.Home?.Favorite[0]?.id as string}
              isInFavoriteList={
                (item.Home?.Favorite.length as number) > 0 ? true : false
              }
              pathName="/favorites"
            />
          ))}
        </div>
      )}
    </section>
  );
}
