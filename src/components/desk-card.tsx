"use client"

import React, { useState, useEffect } from 'react';
import { Shuffle, Filter, Info } from 'lucide-react';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Card from './card';

interface DataItem {
  id: number;
  name: string;
  maxLevel: number;
  maxEvolutionLevel?: number;
  elixirCost?: number;
  iconUrls: {
    medium: string;
    evolutionMedium?: string;
  };
  rarity: string;
}

interface DeskCardProps {
  data: DataItem[];
}

const DeskCard: React.FC<DeskCardProps> = ({ data }) => {
  const [deck, setDeck] = useState<DataItem[]>([]);
  const [availableCards, setAvailableCards] = useState<DataItem[]>([]);
  const [selectedArena, setSelectedArena] = useState("Arena 1 - Training Camp");
  const [filterRarity, setFilterRarity] = useState<string>("all");
  const [showStats, setShowStats] = useState(false);
  const [avgElixirCost, setAvgElixirCost] = useState(0);
  const [draggedCard, setDraggedCard] = useState<DataItem | null>(null);

  const arenaMapping: { [key: string]: string[] } = {
    "Arena 1 - Training Camp": ["Arrows", "Giant", "Bomber", "Knight", "Minion Horde", "Musketeer", "Fireball", "Valkyrie"],
    "Arena 2 - Bone Pit": ["Goblin Barrel", "Goblin Hut", "Goblins", "Barbarians", "Prince"],
    "Arena 3 - Barbarian Bowl": ["Baby Dragon", "Minions", "Lightning"],
    "Arena 4 - P.E.K.K.A's Playhouse": ["P.E.K.K.A", "Tornado"],
    "Arena 5 - Spell Valley": ["Witch", "Inferno Tower"],
    "Arena 6 - Builder's Workshop": ["X-Bow", "Golem", "Cannon Cart"],
    "Arena 7 - Royal Arena": ["Hog Rider", "Electro Wizard"],
    "Arena 8 - Legendary Arena": ["Princess", "Ice Wizard", "Lumberjack"],
    "Arena 9 - Sideshow Arena": ["Elite Barbarians"],
    "Arena 10 - Royal Tournament Arena": ["Mega Minion"],
    "Arena 11 - Tournament Arena": ["Tornado"],
    "Arena 12 - Lava Hound": ["Lava Hound"]
  };

  useEffect(() => {
    if (data) {
      setAvailableCards(getAvailableCards(selectedArena));
    }
  }, [selectedArena, data]);

  const getAvailableCards = (arena: string): DataItem[] => {
    const cardNames = arenaMapping[arena] || [];
    return data.filter(card => cardNames.includes(card.name));
  };

  useEffect(() => {
    const total = deck.reduce((sum, card) => sum + (card.elixirCost || 0), 0);
    setAvgElixirCost(deck.length ? +(total / deck.length).toFixed(1) : 0);
  }, [deck]);

  const handleDragStart = (e: React.DragEvent, card: DataItem) => {
    setDraggedCard(card);
    e.dataTransfer.setData('text/plain', card.id.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropZone: 'deck' | 'available') => {
    e.preventDefault();
    if (!draggedCard) return;

    if (dropZone === 'deck' && deck.length < 8) {
      if (!deck.find(card => card.id === draggedCard.id)) {
        setDeck([...deck, draggedCard]);
      }
    } else if (dropZone === 'available') {
      setDeck(deck.filter(card => card.id !== draggedCard.id));
    }
    setDraggedCard(null);
  };

  const filteredCards = availableCards.filter(card => 
    filterRarity === "all" || card.rarity.toLowerCase() === filterRarity.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <header className="text-center mb-12">
          <motion.h1 
            className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
          >
            Deck Builder
          </motion.h1>
          
          <div className="flex justify-center gap-4 mt-6">
            <Select value={selectedArena} onValueChange={setSelectedArena}>
              <SelectTrigger className="w-64">
                <span>{selectedArena}</span>
              </SelectTrigger>
              <SelectContent>
                {Object.keys(arenaMapping).map(arena => (
                  <SelectItem key={arena} value={arena}>{arena}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterRarity} onValueChange={setFilterRarity}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <span>{filterRarity}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="common">Common</SelectItem>
                <SelectItem value="rare">Rare</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="legendary">Legendary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div 
              className="bg-white rounded-xl p-6 shadow-lg"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'available')}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Available Cards</h2>
                <Badge variant="secondary">{filteredCards.length} cards</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredCards.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card)}
                    className="cursor-move"
                  >
                    <Card {...card} isDragging={draggedCard?.id === card.id} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div 
              className="bg-white rounded-xl p-6 shadow-lg"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'deck')}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Deck</h2>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">{deck.length}/8</Badge>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowStats(true)}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {deck.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card)}
                    className="cursor-move"
                  >
                    <Card {...card} isDragging={draggedCard?.id === card.id} />
                  </div>
                ))}
                {deck.length < 8 && (
                  <div className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                    Drag cards here ({8 - deck.length} slots remaining)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Dialog open={showStats} onOpenChange={setShowStats}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deck Statistics</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Average Elixir Cost</div>
                  <div className="text-2xl font-bold">{avgElixirCost}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Cards</div>
                  <div className="text-2xl font-bold">{deck.length}/8</div>
                </div>
              </div>
              <div className="space-y-2">
                {["common", "rare", "epic", "legendary"].map(rarity => {
                  const count = deck.filter(card => 
                    card.rarity.toLowerCase() === rarity
                  ).length;
                  return (
                    <div key={rarity} className="flex justify-between items-center">
                      <span className="capitalize">{rarity}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default DeskCard;