import DeskCard from "@/components/desk-card";
import Image from "next/image";
import response from '@/components/response.json';
export default function Home() {
  return (
<DeskCard data={response.items} /> 
  );
}
