// navbar.js
import Link from "next/link";
import AddMole from "../../app/addMole";

const Navbar = () => {
    return (
        <header className="bg-indigo-500">
            <div className="flex justify-between items-center p-3">
                <Link href="/">
                    <span className="font-bold text-white text-xl cursor-pointer hover:text-purple-700 transition duration-300" style={{ marginLeft: '20px' }}>List of Heroes</span>
                </Link>
                <AddMole /> 
            </div>
        </header>
    );
};

export default Navbar;
