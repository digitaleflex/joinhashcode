"use client"

import React, { useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Edge, 
  Node, 
  Position,
  MarkerType,
  Handle
} from 'reactflow';
import 'reactflow/dist/style.css';
import { TECH_TREE } from '@/lib/tech-tree';
import { cn } from '@/lib/utils';
import { Zap, Shield, Sparkles, Trophy, Database, Globe } from 'lucide-react';

interface TechTreeVisualizerProps {
  unlockedSkills: string[]; // List of tool/skill names
  userClass?: string;
}

const DOMAIN_ICONS: Record<string, any> = {
  "Web": Globe,
  "Cybersecurity": Shield,
  "Cloud": Zap,
  "IA": Sparkles,
  "Data": Database,
  "UI/UX": Sparkles,
  "DevOps": Trophy,
};

// Custom Node for Tactical Look
const SkillNode = ({ data }: any) => {
  const Icon = data.icon;
  const isUnlocked = data.isUnlocked;
  
  return (
    <div className={cn(
      "px-4 py-2 rounded-xl border transition-all duration-500 flex items-center gap-3 min-w-[140px]",
      isUnlocked 
        ? "bg-primary/10 border-primary/40 shadow-[0_0_15px_rgba(184,255,59,0.2)]" 
        : "bg-zinc-900/60 border-white/5 opacity-50 grayscale"
    )}>
      <Handle type="target" position={Position.Left} className="opacity-0" />
      {Icon && <Icon className={cn("size-4", isUnlocked ? "text-primary" : "text-zinc-500")} />}
      <div className="flex flex-col">
        <span className="text-[10px] font-mono font-bold text-white uppercase tracking-tight">
          {data.label}
        </span>
        {isUnlocked && (
          <span className="text-[7px] font-mono text-primary uppercase">SYNC_OK</span>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
};

const nodeTypes = {
  skill: SkillNode,
};

export function TechTreeVisualizer({ unlockedSkills = [], userClass }: TechTreeVisualizerProps) {
  
  const { nodes, edges } = useMemo(() => {
    const initialNodes: Node[] = [];
    const initialEdges: Edge[] = [];

    // 1. Root Node
    initialNodes.push({
      id: 'root',
      type: 'skill',
      data: { label: 'HASHCODE_CORE', isUnlocked: true, icon: Zap },
      position: { x: 0, y: 300 },
    });

    let domainY = 0;
    const domainSpacing = 150;
    const domains = Object.keys(TECH_TREE);

    domains.forEach((domain, domainIdx) => {
      const domainId = `domain-${domain}`;
      const isDomainUnlocked = TECH_TREE[domain].some(skill => unlockedSkills.includes(skill));

      // 2. Domain Nodes
      initialNodes.push({
        id: domainId,
        type: 'skill',
        data: { label: domain, isUnlocked: isDomainUnlocked, icon: DOMAIN_ICONS[domain] || Globe },
        position: { x: 250, y: domainIdx * domainSpacing },
      });

      initialEdges.push({
        id: `e-root-${domainId}`,
        source: 'root',
        target: domainId,
        animated: isDomainUnlocked,
        style: { stroke: isDomainUnlocked ? '#B8FF3B' : '#27272a', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: isDomainUnlocked ? '#B8FF3B' : '#27272a' },
      });

      // 3. Skill Nodes
      TECH_TREE[domain].forEach((skill, skillIdx) => {
        const skillId = `skill-${skill}`;
        const isSkillUnlocked = unlockedSkills.includes(skill);

        initialNodes.push({
          id: skillId,
          type: 'skill',
          data: { label: skill, isUnlocked: isSkillUnlocked },
          position: { x: 500, y: (domainIdx * domainSpacing) + (skillIdx * 45) - 40 },
        });

        initialEdges.push({
          id: `e-${domainId}-${skillId}`,
          source: domainId,
          target: skillId,
          animated: isSkillUnlocked,
          style: { stroke: isSkillUnlocked ? '#B8FF3B' : '#27272a', strokeWidth: 1.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: isSkillUnlocked ? '#B8FF3B' : '#27272a' },
        });
      });
    });

    return { nodes: initialNodes, edges: initialEdges };
  }, [unlockedSkills]);

  return (
    <div className="h-[600px] w-full bg-black/40 rounded-[2rem] border border-white/5 overflow-hidden relative group">
      <div className="absolute top-6 left-6 z-10 space-y-1">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-primary animate-pulse" />
          <h3 className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">
            Neural_Tech_Tree_v1.0
          </h3>
        </div>
        <p className="text-[9px] text-zinc-500 font-mono">Débloque des missions pour allumer les nodes.</p>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        className="tactical-flow"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#18181b" gap={20} />
        <Controls showInteractive={false} className="bg-zinc-900 border-white/5 fill-zinc-400" />
      </ReactFlow>

      {/* Overlay Blur for "In Progress" look */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)" />
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Zap className="size-64 text-primary -rotate-12" />
      </div>
    </div>
  );
}
