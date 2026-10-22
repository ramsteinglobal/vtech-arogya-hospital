import PageHeader from "../components/PageHeader";
import Doctors from "../components/Doctors";

export default function DoctorsPage() {
  return (
    <>
      <PageHeader title="Meet our doctors" text="Experienced specialists who take the time to listen and explain." />
      <Doctors />
    </>
  );
}