"use client";
//dar inja aval bayad besurat client side bashe.inja bayad session khodemoon ro tarif bokonim ke bad mirim tu bakhsh layout dor barnamamun wrap mikonim.
import { SessionProvider } from "next-auth/react";

function NextAuthProvider({ children }) {
  //dar in ja children gharar midahim ke vaghti dore layout wrap shod ,layout biad bejaye children gharar begire.
  return <SessionProvider>{children}</SessionProvider>;
}
export default NextAuthProvider;
