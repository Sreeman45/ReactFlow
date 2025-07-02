import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";

//Navbar component
const Navbar = () => {
  const { getEdges, getNodes } = useReactFlow();
  function handleSave() {
    const nodes = getNodes();
    const edges = getEdges();
    if (nodes.length <= 1) {
      toast.error("Flow must have more than one node to save.");
      return;
    }
    const disconnectedNodes = nodes.filter((node) => {
      const hasIncoming = edges.some((edge) => edge.target === node.id);
      return !hasIncoming;
    });
    if (disconnectedNodes.length > 1) {
      toast.error(" atleast one incoming edge should be present on one node");
      return;
    }
    const flowData = {
      nodes,
      edges,
    };
    localStorage.setItem("savedFlow", JSON.stringify(flowData));
    toast.success("successfully saved");
  }
  return (
    <header className="w-full h-16 top-0 bg-gray-200">
      <nav className="w-full flex  items-center h-full justify-end px-20 ">
        <button
          className="text-blue-600 border-2 border-blue-500 rounded px-4 py-2  font-sans font-bold text-[14px] cursor-pointer "
          onClick={handleSave}
        >
          Save Changes
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
