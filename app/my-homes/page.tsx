import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "../lib/db";
import { redirect } from "next/dist/server/api-utils";
import { ListingCard } from "../components/ListingCard";
import { NoItems } from "../components/NoItems";

async function getData(userId: string) {
  const data = await prisma.home.findMany({
    where: {
      UserId: userId,
      addedCategory: true,
      addedDescription: true,
      addedLocation: true,
    },
    select: {
      id: true,
      photo: true,
      description: true,
      price: true,
      country: true,
      Favorite: {
        where: {
          UserId: userId,
        },
      },
    },
    orderBy: {
      createdAT: "desc",
    },
  });
  return data;
}

export default async function MyHomes() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return redirect("/");
  const data = await getData(user.id);
  return (
    <section className="container mx-auto px-5 lg:px-10 mt-10">
      <h2 className="text-3xl font-semibold tracking-tight transition-colors">
        Your Home
      </h2>

      {data.length === 0 ? (
        <NoItems
          title="Hey, You dont have any Homes listed"
          description="Please list a home on airbnb so that you can see it right here..."
        />
      ) : (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8 mt-8">
          {data.map((item) => (
            <ListingCard
              key={item.id}
              imagePath={item.photo as string}
              description={item.description as string}
              price={item.price as number}
              location={item.country as string}
              userId={user?.id as string}
              homeId={item.id as string}
              favoriteId={item.Favorite[0]?.id as string}
              isInFavoriteList={
                (item.Favorite.length as number) > 0 ? true : false
              }
              pathName="/my-homes"
            />
          ))}
        </div>
      )}
    </section>
  );
}
