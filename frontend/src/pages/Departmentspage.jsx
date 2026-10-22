import PageHeader from "../components/PageHeader";
import Departments from "../components/Departments";

export default function DepartmentsPage() {
  return (
    <>
      <PageHeader title="Our departments" text="Specialised teams for the heart, brain, bones and cancer care, working together under one roof." />
      <Departments />
    </>
  );
}