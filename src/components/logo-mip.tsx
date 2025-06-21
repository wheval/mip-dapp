import Link from 'next/link'
import Image from "next/image";

export function LogoMip() {
  return (
    <div className="flex items-center space-x-2 ml-4">
    <Link href="/">
      
        <Image
          className="hidden dark:block"
          src="/mip.png"
          alt="dark-mode-image"
          width={40}
          height={40}
        />
        <Image
          className="block dark:hidden"
          src="/mip.png"
          alt="light-mode-image"
          width={40}
          height={40}
        />
         
    </Link>
    </div>
  )
}