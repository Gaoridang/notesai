import Link from "next/link";

export default async function Index() {
  return (
    <div className="">
      <Link href="/done">추가</Link>
      <Link href="/search">검색</Link>
    </div>
  );
}
