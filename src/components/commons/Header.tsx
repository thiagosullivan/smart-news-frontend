import { Button } from "../ui/button";

const Header = () => {
  return (
    <header className="bg-white">
      <div className="centered-container">
        <h1>Header</h1>
        <Button
          className="bg-gray-600 cursor-pointer"
          onClick={() => console.log("clickado")}
        >
          BOTÃO
        </Button>
      </div>
    </header>
  );
};

export default Header;
