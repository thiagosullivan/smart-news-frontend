import SearchComponent from "@/components/commons/Search";
import Accounts from "@/components/Home/Accounts";

const HomePage = () => {
  return (
    <section className="bg-white mt-4">
      <div className="centered-container py-4">
        <SearchComponent />
        <Accounts />
      </div>
    </section>
  );
};

export default HomePage;
