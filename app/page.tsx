import Link from "next/link";

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Link href="/done">추가</Link>
      <Link href="/search">검색</Link>
    </div>
  );
}
