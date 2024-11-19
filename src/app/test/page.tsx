import Exercise from "@/components/Exercise";
import { UserExcerciseAnswerAction } from "@/lib/ServerAction/userExcerciseAnswerAction";
const exerciseProps = {
  title: "SQL Query Exercise",
  prompt: "Write a query to fetch all employees from the 'employees' table where their department is 'Engineering'.",
  tables: ["employees", "departments"],
  answer: "SELECT * FROM employees WHERE department = 'Engineering';",
  difficulty: "Medium"
};

export default function Page() {
  return (
    <div className="container mx-auto">
      <Exercise {...exerciseProps} />
    </div>
  );
}
