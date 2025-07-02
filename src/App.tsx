import {
  addEdge,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useReactFlow,
  type Connection,
  type Node,
} from "@xyflow/react";
import { useNodesState } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./App.css";
import ErrorBoundary from "./components/errorboundary";
import { useCallback, useRef, useState } from "react";
import Navbar from "./components/navbar";
import { ArrowLeft, MessageCircleMore } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import {
  initialEdges,
  initialNodes,
  id,
} from "./components/workflow.constants";
import Message from "./components/message";
import { Toaster } from "sonner";

//initial ids
let idid = id;

type nodeType = "message";

//Message component for nodes
const nodeTypes = {
  message: Message as any,
};

//core component for react flow canvas
function FlowComponent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<{
    message: string;
  }> | null>(null);
  const inputref = useRef<HTMLInputElement>(null);
  const dragref = useRef<nodeType | null>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [message, setMessage] = useState(true);

  const onConnect = useCallback((connection: Connection) => {
    const edge = { ...connection, animated: true, id: uuidv4() };
    setEdges((eds: any) => addEdge(edge, eds));
  }, []);

  const onDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>, type: nodeType) => {
      dragref.current = type;
      event.dataTransfer.effectAllowed = "move";
    },
    []
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = dragref.current;
      if (!type) return;
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const node: Node<{ message: string }> = {
        id: uuidv4(),
        position,
        data: { message: ` test node ${idid++ + 1} ` },
        type: type,
      };
      if (node) setNodes((prev) => prev.concat(node));
    },
    [screenToFlowPosition]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView={true}
      onDragOver={onDragOver}
      onDrop={onDrop}
      nodeTypes={nodeTypes}
      onNodeClick={(_, node) => {
        setSelectedNode(node as Node<{ message: string }>);
        setMessage(false);
        if (inputref != null) {
          inputref.current?.focus();
        }
      }}
    >
      <Panel
        position="top-right"
        className=" border-l-[1.5px] border-t-[1.5px]  border-gray-400 rounded flex h-full w-2/9 "
      >
        {message ? (
          <div
            className="h-24 w-1/2 self-start flex flex-col items-center justify-center cursor-pointer gap-2 border-[2px] border-blue-500  rounded mt-2 ml-2"
            draggable
            onDragStart={(event) => onDragStart(event, "message")}
          >
            <MessageCircleMore className="text-blue-500 size-8 " />
            <div className="text-blue-500 text-lg font-semibold">Message</div>
          </div>
        ) : (
          <section className="w-full h-auto ">
            <div className="grid grid-cols-3 py-2 items-center w-full px-2 border-b-[0.5px] border-gray-400">
              <div
                className="flex justify-start text-gray-600 cursor-pointer"
                onClick={() => setMessage(!message)}
              >
                <ArrowLeft />
              </div>
              <h2 className="font-bold text-gray-700 text-lg self-center cursor-pointer ">
                Message
              </h2>
            </div>
            <div className="w-full h-1/4 px-4 py-4 border-b-[0.5px] border-gray-400 ">
              <div className="flex flex-col gap-3 h-full  ">
                <div className="text-sm text-gray-600">Text</div>
                <div className="flex items-start justify-start border-[1.5px] border-gray-400 h-full px-2 py-2 ">
                  <input
                    className="w-full focus:outline-none focus:border-none "
                    ref={inputref}
                    value={selectedNode?.data.message || ""}
                    onChange={(e) => {
                      const updated = nodes.map((data) => {
                        return data.id === selectedNode?.id
                          ? { ...data, data: { message: e.target.value } }
                          : data;
                      });
                      setNodes(updated);
                      setSelectedNode((prev) =>
                        prev
                          ? {
                              ...prev,
                              data: { ...prev.data, message: e.target.value },
                            }
                          : prev
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}
      </Panel>
      <Controls />
    </ReactFlow>
  );
}

//main function app
function App() {
  return (
    <ErrorBoundary>
      <ReactFlowProvider>
        <Toaster richColors position="top-center" />

        <Navbar />
        <div className="h-[calc(100vh-4rem)]">
          <FlowComponent />
        </div>
      </ReactFlowProvider>
    </ErrorBoundary>
  );
}

export default App;
