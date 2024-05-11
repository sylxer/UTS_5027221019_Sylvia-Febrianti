    import AddMole from "./addMole";
    import DeleteMole from "./deleteMole";
    import UpdateMole from "./updateMole";

    export const metadata = {
        title: "Mole List",
    };

    type Mole = {
        id: string;
        hero: string;
        release: number;
        role: string;
        lane: string;
        image: string;
    };

    async function getMoles() {
        try {
            const res = await fetch("http://localhost:5555/", {
                cache: "no-store",
            });
            const data = await res.json();
            return data.moles; // Pastikan Anda mengambil array 'moles' dari respons
        } catch (error) {
            console.error("Error fetching moles:", error);
            throw error;
        }
    }

    export default async function MoleList() {
        const moles: Mole[] = await getMoles();
        return (
            <div className="py-10 px-10">
                <div className="flex justify-center items-center">
                    <div className="grid grid-cols-5 gap-10 h-32">
                        {moles.map((mole) => (
                            <div key={mole.id} className="border p-5 flex flex-col items-center " >
                                <img
                                    src={`http://localhost:5555/${mole.image}`}
                                    alt={mole.hero}
                                    className="h-50 w-auto"
                                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                                />
                                <strong>Hero: {mole.hero}</strong>
                                <strong>Release: {mole.release}</strong>
                                <strong>Role: {mole.role}</strong>
                                <strong>Lane: {mole.lane}</strong>
                                <div className="flex">
                                    <div className="mr-1">
                                        <UpdateMole {...mole} />
                                    </div>
                                    <DeleteMole {...mole} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
