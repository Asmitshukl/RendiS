import toposort from "toposort"
import { Node ,Connection } from "@/generated/prisma/client"
import { inngest } from "./client";

export const topologicalSort = (
    nodes : Node[],
    connections : Connection[],
): Node[] => {

    // if no connections return nodea as it is (they re ll independent nothing to execute)
    if(connections.length === 0){
        return nodes;
    }

    //create edges array for transport
    const edges: [string,string][] = connections.map((conn)=>[
        conn.fromNodeId,
        conn.toNodeId
    ]);

    //add nodes with no connections as self edges to ensure they are included
    const connectedNodeIds = new Set<string>();
    for (const conn of connections){
        connectedNodeIds.add(conn.fromNodeId);
        connectedNodeIds.add(conn.toNodeId);
    }
    
    for (const node of nodes){
        if(!connectedNodeIds.has(node.id)){
            edges.push([node.id, node.id])
        }
    }

    //doing topological sort
    let sortedNodeIds : string[]
    try{
        sortedNodeIds = toposort(edges);
        sortedNodeIds= [...new Set(sortedNodeIds)];
    }catch(e){
        if(e instanceof Error && e.message.includes("Cyclic")){
            throw new Error("workflow contains a cycle");
        }
        throw e;
    }

    //maping sorted ids back to node objects
    const nodeMap = new Map(nodes.map((n)=>[
        n.id,n
    ]));

    return sortedNodeIds.map((id)=> nodeMap.get(id)!).filter(Boolean);


}

export const sendWorkflowExecution = async(data : {
    workflowId : string;
    [key : string] : any;
})=>{
    return inngest.send({
        name:"workflow/execute.workflow",
        data
    })
}