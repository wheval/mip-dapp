import Link from 'next/link'
import Image from "next/image";

export function LogoMip() {
  return (
    <div className="flex items-center space-x-2 ml-4">
    <Link href="/">
        <Image
          src="/mip.png"
          alt="MIP Dapp"
          width={40}
          height={40}
        />
    </Link>
    </div>
  )
}