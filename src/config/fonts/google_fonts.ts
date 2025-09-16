import { Karla, Outfit } from 'next/font/google'


export const outfit = Outfit({
  weight: [ "400" , "100" , "200" , "300" , "500" , "600" , "700" , "800" , "900" ],
  subsets: ['latin'],
  variable: '--font-outfit',
  preload: true
})


export const karla = Karla({
  weight: [ "400" , "200" , "300" , "500" , "600" , "700" , "800" , ],
  subsets: ['latin'],
  variable: '--font-karla',
  preload: true
})