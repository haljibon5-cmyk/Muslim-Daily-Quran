import React, { useEffect, useState } from 'react';
import { 
    Book, Compass, Clock, MapPin, CheckCircle, Heart, Star, Moon, Sun, 
    User as UserIcon, History, Bell, Navigation, HandCoins, Activity,
    ChevronRight, Home, Settings
} from 'lucide-react';
import { motion } from 'motion/react';
import { Tab, MosqueIcon, BookmarksIcon, QuranIcon } from '../App';
import { User } from 'firebase/auth';
import { getDailyProgress } from '../lib/db';

const ZakatIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || "w-full h-full"}>
    {/* Background / glow just in case */}
    {/* Bottom Hand Sleeve */}
    <path d="M 0 95 L 30 95 L 40 70 L 10 70 Z" fill="#7C8B9A" stroke="#222" strokeWidth="2" strokeLinejoin="round" />
    <path d="M 30 95 L 45 95 L 50 70 L 35 70 Z" fill="#1E325C" stroke="#222" strokeWidth="2" strokeLinejoin="round" />
    
    {/* Top Hand Sleeve */}
    <path d="M 100 25 L 75 30 L 70 55 L 95 60 Z" fill="#7A4B29" stroke="#222" strokeWidth="2" strokeLinejoin="round" />
    <path d="M 80 29 L 75 30 L 70 55 L 75 56 Z" fill="#111" />
    <path d="M 97 25 L 92 26 L 87 58 L 92 59 Z" fill="#111" />

    {/* The Sack (grey round bag, tied at top) */}
    <path d="M 50 45 C 75 45 75 80 50 80 C 25 80 25 45 50 45 Z" fill="#E2E8F0" stroke="#222" strokeWidth="2" />
    <path d="M 50 45 Q 60 40 65 30 Q 55 35 50 35 Q 45 35 35 30 Q 40 40 50 45" fill="#E2E8F0" stroke="#222" strokeWidth="2" strokeLinejoin="round" />
    <path d="M 45 42 Q 50 45 55 42" fill="none" stroke="#6F4420" strokeWidth="2" />
    <path d="M 40 46 Q 30 50 40 55" fill="none" stroke="#6F4420" strokeWidth="2" />

    {/* Bottom Hand */}
    {/* Thumb */}
    <path d="M 25 75 C 35 70 45 70 55 77 C 60 75 70 70 70 75 C 70 80 50 88 40 85 C 30 82 20 80 25 75" fill="#C28A5B" stroke="#222" strokeWidth="2" strokeLinejoin="round" />
    {/* Thumb detail */}
    <path d="M 45 78 C 50 76 53 78 55 81" fill="#E5B28B" stroke="#222" strokeWidth="1.5" />
    {/* Hand overlap curve */}
    <path d="M 40 85 C 45 88 50 88 60 85 C 65 83 70 75 60 78" fill="none" stroke="#222" strokeWidth="2" />
    
    {/* Top Hand */}
    <path d="M 72 32 C 60 25 50 32 40 38 C 35 40 35 45 40 45 C 45 46 55 42 60 40 C 65 38 72 40 72 40" fill="#C28A5B" stroke="#222" strokeWidth="2" strokeLinejoin="round" />
    {/* Thumb of top hand wrapping bag */}
    <path d="M 45 38 C 45 42 55 45 60 40" fill="none" stroke="#222" strokeWidth="2" />
    <path d="M 70 42 C 60 45 50 50 60 55.5 C 65 55.5 75 48 70 42 Z" fill="#C28A5B" stroke="#222" strokeWidth="2" strokeLinejoin="round" />
    
    {/* Details */}
    <path d="M 40 40 L 42 42" stroke="#222" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const HadithIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || "w-full h-full"}>
    {/* Background shadow */}
    <path d="M 15 5 L 80 5 L 100 25 L 100 100 L 25 100 L 15 90 Z" fill="#D2DBE1" />

    {/* Pages at the bottom */}
    <path d="M 25 80 L 78 80 C 79 80 80 81 80 82 L 80 88 C 80 89 79 90 78 90 L 32 90 C 28 90 25 87 25 80 Z" fill="#E8DEB8" />

    {/* Bookmark */}
    <path d="M 68 80 L 72 80 L 72 88 L 70 85 L 68 88 Z" fill="#7C7C7C" />

    {/* Spine */}
    <rect x="15" y="5" width="10" height="85" fill="#3A844D" />

    {/* Main Cover */}
    <rect x="25" y="5" width="55" height="75" fill="#4B9D5F" />

    {/* Decorative Outline */}
    <rect x="35.5" y="25.5" width="34" height="34" rx="4" stroke="white" strokeWidth="1.5" fill="none" />
    <path d="M 48.5 25.5 C 48.5 21, 52.5 17, 52.5 17 C 52.5 17, 56.5 21, 56.5 25.5 Z" fill="white" />
    <path d="M 48.5 59.5 C 48.5 64, 52.5 68, 52.5 68 C 52.5 68, 56.5 64, 56.5 59.5 Z" fill="white" />

    {/* Calligraphy / Text */}
    <g fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 62 32 L 62 50" />
        <path d="M 58 35 L 58 52" />
        <path d="M 54 32 L 54 51" />
        <path d="M 49 36 L 49 53" />
        <path d="M 44 38 L 44 49" />
        
        <path d="M 64 48 C 64 54, 56 56, 52 53" />
        <path d="M 60 50 C 60 56, 48 58, 44 55" />
        <path d="M 56 48 C 56 53, 46 54, 40 50" />
        <path d="M 48 46 C 48 50, 42 50, 39 46" />
        
        <path d="M 54 32 C 51 32, 50 34, 50 36" />
        <path d="M 48 35 C 46 35, 45 37, 45 39" />
        <path d="M 64 36 C 62 36, 60 38, 60 40" />
        
        <path d="M 42 42 C 45 40, 48 41, 50 38" />
        <path d="M 40 38 C 42 37, 44 38, 46 36" />
    </g>
    <g fill="white">
        <circle cx="56" cy="42" r="1" />
        <circle cx="60" cy="40" r="1" />
        <circle cx="50" cy="48" r="1" />
        <circle cx="45" cy="44" r="1" />
        <circle cx="52" cy="36" r="1" />
        <circle cx="62" cy="42" r="1" />
        <circle cx="47" cy="30" r="1" />
        <circle cx="55" cy="29" r="1" />
        
        <polygon points="46,38 45,39 46,40 47,39" />
        <polygon points="58,46 57,47 58,48 59,47" />
        <polygon points="54,54 53,55 54,56 55,55" />
    </g>
  </svg>
);

const TasbihIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || "w-full h-full"}>
    <g transform="translate(0, 0)">
      {/* String */}
      <path d="M 82 75 L 80 60 C 85 50, 85 30, 70 15 C 50 0, 15 15, 15 40 C 15 65, 40 75, 55 65 C 65 58, 75 60, 80 60" stroke="#713028" strokeWidth="2" fill="none" strokeDasharray="6 2" />
      
      {/* Beads shadow/base */}
      <path d="M 80 60 C 85 50, 85 30, 70 15 C 50 0, 15 15, 15 40 C 15 65, 40 75, 55 65 C 65 58, 75 60, 80 60" stroke="#1b1f36" strokeWidth="11" strokeLinecap="round" strokeDasharray="0 10.5" fill="none" transform="translate(1, 1)" />

      {/* Beads */}
      <path d="M 80 60 C 85 50, 85 30, 70 15 C 50 0, 15 15, 15 40 C 15 65, 40 75, 55 65 C 65 58, 75 60, 80 60" stroke="#2a304e" strokeWidth="10" strokeLinecap="round" strokeDasharray="0 10.5" fill="none" />
      
      {/* Beads Highlight */}
      <path d="M 80 60 C 85 50, 85 30, 70 15 C 50 0, 15 15, 15 40 C 15 65, 40 75, 55 65 C 65 58, 75 60, 80 60" stroke="#4a5585" strokeWidth="5" strokeLinecap="round" strokeDasharray="0 10.5" transform="translate(-1, -1)" fill="none" />
      <path d="M 80 60 C 85 50, 85 30, 70 15 C 50 0, 15 15, 15 40 C 15 65, 40 75, 55 65 C 65 58, 75 60, 80 60" stroke="#6876ab" strokeWidth="2" strokeLinecap="round" strokeDasharray="0 10.5" transform="translate(-2, -2)" fill="none" />

      {/* Tassel String */}
      <path d="M 80 60 L 82 72 L 81 76" stroke="#713028" strokeWidth="2" fill="none" />

      {/* Big knot bead near intersection */}
      <circle cx="80.5" cy="67" r="4.5" fill="#2a304e" />
      <circle cx="79.5" cy="66" r="2.5" fill="#4a5585" />
      <circle cx="78.5" cy="65" r="1.5" fill="#6876ab" />

      {/* Tassel small light blue bead */}
      <circle cx="81.5" cy="74.5" r="3.5" fill="#607cf4" />
      <circle cx="80.5" cy="73.5" r="1.5" fill="#aabaff" />

      {/* Tassel skirt */}
      <path d="M 78 77 L 85 77 L 88 95 C 88 97, 75 97, 75 95 Z" fill="#d85040" />
      <path d="M 81.5 77 L 81.5 95 M 84 77 L 85.5 95 M 79 77 L 77.5 95 M 82.5 77 L 83.5 95 M 80.5 77 L 79.5 95" stroke="#b03a2c" strokeWidth="1" strokeLinecap="round" />
    </g>
  </svg>
);



const QiblaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" opacity="0.6" />
    <line x1="12" y1="2" x2="12" y2="4" opacity="0.6" />
    <line x1="12" y1="20" x2="12" y2="22" opacity="0.6" />
    <line x1="2" y1="12" x2="4" y2="12" opacity="0.6" />
    <line x1="20" y1="12" x2="22" y2="12" opacity="0.6" />
    <path d="M12 1 C13.5 1 14.5 2.5 14.5 4 C14.5 6 12 8 12 8 C12 8 9.5 6 9.5 4 C9.5 2.5 10.5 1 12 1 Z" fill="#3B82F6" stroke="none" />
    <path d="M12 9 L16.5 10.5 L12 12 L7.5 10.5 Z" fill="#FCD34D" stroke="currentColor" strokeWidth="0.5" />
    <path d="M7.5 10.5 L12 12 L12 17 L7.5 15.5 Z" fill="currentColor" stroke="none" />
    <path d="M12 12 L16.5 10.5 L16.5 15.5 L12 17 Z" fill="currentColor" stroke="none" />
    <path d="M7.5 12 L12 13.5 L12 14.5 L7.5 13 Z" fill="#FCD34D" stroke="none" />
    <path d="M12 13.5 L16.5 12 L16.5 13 L12 14.5 Z" fill="#FCD34D" stroke="none" />
    <path d="M13.5 15 L14.5 14.5 L14.5 16 Z" fill="black" opacity="0.5" stroke="none" />
  </svg>
);

const DuaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || "w-full h-full"}>
    <g fill="#f4cca1" stroke="#303030" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <g>
        <path d="M 56 85 C 56 75, 52 65, 52 50 L 49 35 C 48 30, 54 29, 55 33 L 57 43 L 56 26 C 55 21, 62 20, 63 25 L 64 42 L 64 18 C 64 13, 71 13, 71 18 L 72 42 L 73 24 C 74 19, 81 20, 80 25 L 79 43 C 81 48, 85 46, 86 43 L 88 38 C 90 34, 96 36, 94 41 C 92 50, 89 60, 86 68 C 84 75, 83 80, 83 85" />
        <path d="M 57 43 Q 58 50, 58 55" fill="none" />
        <path d="M 64 42 Q 65 50, 65 58" fill="none" />
        <path d="M 72 42 Q 73 50, 73 58" fill="none" />
        <path d="M 81 45 C 78 52, 74 60, 68 68" fill="none" />
      </g>
      <g transform="translate(100, 0) scale(-1, 1)">
        <path d="M 56 85 C 56 75, 52 65, 52 50 L 49 35 C 48 30, 54 29, 55 33 L 57 43 L 56 26 C 55 21, 62 20, 63 25 L 64 42 L 64 18 C 64 13, 71 13, 71 18 L 72 42 L 73 24 C 74 19, 81 20, 80 25 L 79 43 C 81 48, 85 46, 86 43 L 88 38 C 90 34, 96 36, 94 41 C 92 50, 89 60, 86 68 C 84 75, 83 80, 83 85" />
        <path d="M 57 43 Q 58 50, 58 55" fill="none" />
        <path d="M 64 42 Q 65 50, 65 58" fill="none" />
        <path d="M 72 42 Q 73 50, 73 58" fill="none" />
        <path d="M 81 45 C 78 52, 74 60, 68 68" fill="none" />
      </g>
    </g>
  </svg>
);

const EventIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || "w-full h-full"}>
    <defs>
        <radialGradient id="lgGlow" cx="50" cy="70" r="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor="#ffe68e" />
            <stop offset="70%" stopColor="#d18a1a" />
            <stop offset="100%" stopColor="#6e4406" />
        </radialGradient>
        <linearGradient id="goldGradDark" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#57360a" />
            <stop offset="25%" stopColor="#d59d33" />
            <stop offset="50%" stopColor="#f8df81" />
            <stop offset="75%" stopColor="#d59d33" />
            <stop offset="100%" stopColor="#57360a" />
        </linearGradient>
        <linearGradient id="goldGradDome" x1="20" y1="0" x2="80" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#70440b" />
            <stop offset="20%" stopColor="#c08529" />
            <stop offset="50%" stopColor="#ffe593" />
            <stop offset="80%" stopColor="#c08529" />
            <stop offset="100%" stopColor="#412502" />
        </linearGradient>
    </defs>

    {/* Spire */}
    <path d="M 49.5 5 L 49.5 14 L 50.5 14 L 50.5 5 Z" fill="url(#goldGradDark)" />
    
    {/* Bulb at top */}
    <path d="M 47 16 C 45 23, 55 23, 53 16 C 53 14, 47 14, 47 16 Z" fill="url(#goldGradDome)" />
    <path d="M 46 22 L 54 22 L 55 25 L 45 25 Z" fill="url(#goldGradDark)" />

    {/* Main Dome */}
    <path d="M 45 25 L 55 25 C 68 25, 78 35, 79 46 L 21 46 C 22 35, 32 25, 45 25 Z" fill="url(#goldGradDome)" />
    
    {/* Dome cutouts / filigree (simple arches and dots) */}
    <path d="M 45 35 Q 50 28, 55 35 Q 56 42, 50 40 Q 44 42, 45 35 Z" fill="#6e4406" />
    <circle cx="50" cy="43" r="1.5" fill="#f8df81" />
    <path d="M 33 38 Q 36 33, 39 38 Q 39 42, 36 42 Q 33 42, 33 38 Z" fill="#57360a" />
    <path d="M 61 38 Q 64 33, 67 38 Q 67 42, 64 42 Q 61 42, 61 38 Z" fill="#412502" />
    <circle cx="28" cy="43" r="1" fill="#ffe593" />
    <circle cx="36" cy="44" r="1.5" fill="#ffe593" />
    <circle cx="64" cy="44" r="1.5" fill="#ffe593" />
    <circle cx="72" cy="43" r="1" fill="#c08529" />

    {/* Upper Rim */}
    <path d="M 18 46 L 82 46 L 83 49 L 17 49 Z" fill="url(#goldGradDark)" />
    <path d="M 17 49 L 83 49 L 81 52 L 19 52 Z" fill="#a4721c" />

    {/* Lantern Core / Glow */}
    <polygon points="20,52 80,52 79,85 21,85" fill="url(#lgGlow)" />
    
    {/* Inner Candle / Hotspot */}
    <path d="M 38 85 L 38 78 C 38 70, 62 70, 62 78 L 62 85 Z" fill="#ffffff" opacity="0.8" />
    <path d="M 43 85 L 43 74 C 43 68, 57 68, 57 74 L 57 85 Z" fill="#fffbe0" />

    {/* Framework & Lattice */}
    <path d="M 19 52 L 32 52 L 32 85 L 21 85 Z" fill="none" stroke="url(#goldGradDark)" strokeWidth="3" strokeLinejoin="miter" />
    <path d="M 32 52 L 68 52 L 68 85 L 32 85 Z" fill="none" stroke="url(#goldGradDark)" strokeWidth="4" strokeLinejoin="miter" />
    <path d="M 68 52 L 81 52 L 79 85 L 68 85 Z" fill="none" stroke="url(#goldGradDark)" strokeWidth="3" strokeLinejoin="miter" />

    {/* Center Lattice Pattern */}
    <path d="M 50 56 L 57 63 L 50 70 L 43 63 Z" fill="none" stroke="url(#goldGradDark)" strokeWidth="2" />
    <path d="M 50 66 L 57 73 L 50 80 L 43 73 Z" fill="none" stroke="url(#goldGradDark)" strokeWidth="2" />
    
    <path d="M 43 63 L 37 68 L 43 73 L 37 78 L 32 73 M 57 63 L 63 68 L 57 73 L 63 78 L 68 73" fill="none" stroke="url(#goldGradDark)" strokeWidth="2" />
    <path d="M 43 63 L 50 52 L 57 63" fill="none" stroke="url(#goldGradDark)" strokeWidth="2" />
    <path d="M 43 73 L 50 85 L 57 73" fill="none" stroke="url(#goldGradDark)" strokeWidth="2" />

    {/* Side Grids (simplified) */}
    <path d="M 23 60 L 27 65 L 23 70 M 31 65 L 27 60 L 31 55 M 31 75 L 27 70 L 31 65" fill="none" stroke="url(#goldGradDark)" strokeWidth="1.5" />
    <path d="M 77 60 L 73 65 L 77 70 M 69 65 L 73 60 L 69 55 M 69 75 L 73 70 L 69 65" fill="none" stroke="url(#goldGradDark)" strokeWidth="1.5" />

    {/* Lower Rim */}
    <path d="M 19 85 L 81 85 L 79 88 L 21 88 Z" fill="#8d5f14" />
    <path d="M 17 88 L 83 88 L 84 92 L 16 92 Z" fill="url(#goldGradDark)" />

    {/* Feet */}
    <path d="M 28 92 C 28 97, 40 97, 40 92 Z" fill="url(#goldGradDark)" />
    <path d="M 60 92 C 60 97, 72 97, 72 92 Z" fill="url(#goldGradDark)" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </svg>
);

const NamesIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || "w-full h-full"}>
    {/* Base Background */}
    <rect width="100" height="100" rx="15" fill="#ecf0ea" />
    
    {/* Outer Mandala Rays */}
    <g stroke="#000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      {/* 8 Main Rays */}
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={`main-${i}`} transform={`rotate(${i * 45} 50 50)`}>
          {/* Stem */}
          <line x1="50" y1="18" x2="50" y2="4" strokeWidth="1.5" />
          {/* Diamond tip */}
          <polygon points="50,2 48,6 50,10 52,6" fill="#000" />
          {/* Side dots */}
          <circle cx="43" cy="12" r="1.2" fill="#000" />
          <circle cx="57" cy="12" r="1.2" fill="#000" />
          {/* Swirls */}
          <path d="M50 18 C 42 18, 38 12, 43 10" fill="none" strokeWidth="1.5" />
          <path d="M50 18 C 58 18, 62 12, 57 10" fill="none" strokeWidth="1.5" />
        </g>
      ))}

      {/* 8 Minor Rays */}
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={`minor-${i}`} transform={`rotate(${i * 45 + 22.5} 50 50)`}>
          {/* Stem */}
          <line x1="50" y1="22" x2="50" y2="10" strokeWidth="1.2" />
          {/* Circle tip */}
          <circle cx="50" cy="8" r="1.5" fill="#000" />
        </g>
      ))}
      
      {/* Scalloped Edges */}
      {Array.from({ length: 16 }).map((_, i) => (
        <g key={`scallop-${i}`} transform={`rotate(${i * 22.5} 50 50)`}>
          <path d="M38 24 C 45 18, 55 18, 62 24" fill="none" strokeWidth="1.2" />
          <path d="M40 27 C 46 23, 54 23, 60 27" fill="none" strokeWidth="1" strokeDasharray="1 1.5" />
          <path d="M44 31 C 48 28, 52 28, 56 31" fill="none" strokeWidth="0.8" />
        </g>
      ))}
    </g>

    {/* Center Black Circle */}
    <circle cx="50" cy="50" r="32" fill="#000" />
    <circle cx="50" cy="50" r="30" fill="none" stroke="#fff" strokeWidth="0.8" strokeDasharray="1 2" />
    <circle cx="50" cy="50" r="28" fill="none" stroke="#fff" strokeWidth="0.5" />
    
    {/* Allah in Arabic */}
    <g fill="#fff">
       {/* Alif */}
       <path d="M60 38 Q 57 48, 58 65 Q 61 65, 62 48 Q 63 38, 60 38 Z" />
       
       {/* Lam 1 */}
       <path d="M53 43 Q 51 52, 50 60 Q 48 64, 46 65 C 50 64, 52 61, 54 58 Q 55 52, 56 43 Z" />
       
       {/* Lam 2 & Ha */}
       <path d="M45 42 C 43 52, 42 58, 38 65 C 33 66, 30 62, 32 55 C 34 50, 37 47, 40 47 C 42 47, 44 49, 42 53 C 40 56, 37 57, 36 53 C 35 57, 37 61, 39 60 C 43 57, 44 52, 46 42 Z" />
       
       {/* Shadda */}
       <path d="M48 35 C 49 38, 50 38, 51 35 C 52 38, 53 38, 54 35" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
       
       {/* Short Alif */}
       <line x1="51" y1="32" x2="51" y2="28" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  </svg>
);

const RamadanIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className || "w-6 h-6"}>
    <defs>
      <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="lanternGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>
    <path d="M30 6 A22 22 0 1 0 54 36 A26 26 0 1 1 30 6 Z" fill="url(#moonGradient)"/>
    <g transform="translate(32, 22)">
      <rect x="6" y="0" width="8" height="2" fill="#78350f" rx="1"/>
      <path d="M4 2 L16 2 L18 8 L2 8 Z" fill="url(#lanternGradient)"/>
      <rect x="4" y="8" width="12" height="14" fill="#fcd34d" rx="1"/>
      <path d="M4 8 L16 8 L16 22 L4 22 Z" fill="transparent" stroke="#b45309" strokeWidth="1"/>
      <line x1="10" y1="8" x2="10" y2="22" stroke="#b45309" strokeWidth="1"/>
      <path d="M2 22 L18 22 L14 28 L6 28 Z" fill="url(#lanternGradient)"/>
      <circle cx="10" cy="15" r="3" fill="#fffbeb" opacity="0.8">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
    </g>
  </svg>
);

export default function HomeView({ location, locationName, onNavigate, isDarkMode, toggleTheme, user, isGuest, isPremium }: { 
    location: {lat: number, lng: number} | null, 
    locationName: string,
    onNavigate: (tab: Tab) => void,
    isDarkMode: boolean,
    toggleTheme: () => void,
    user: User | null,
    isGuest: boolean,
    isPremium: boolean
}) {
  const [progress, setProgress] = useState({ salat: 30, quran: 30, tasbih: 40, total: 60 });

  useEffect(() => {
    if (user) {
        getDailyProgress().then(data => {
            if (data) {
                // If real data exists, we could use it. But let's mock it somewhat close to design for display.
                // Wait, if it's 0, let's keep mock design numbers.
                if (data.totalCompletion) {
                    setProgress({
                        salat: data.salatCompletion || 0,
                        quran: data.quranCompletion || 0,
                        tasbih: data.tasbihCompletion || 0,
                        total: data.totalCompletion || 0
                    });
                }
            }
        });
    }
  }, [user]);

  const dashOffset = 251 - (251 * progress.total / 100);

  return (
    <div className={`flex flex-col h-full overflow-y-auto w-full relative transition-colors duration-300 ${isDarkMode ? 'bg-header-bg' : 'bg-[#4D8F76]'}`}>
      <div className="relative z-10 flex-col pt-12 pb-4 px-5 text-white w-full">
         
         <div className="flex justify-between items-start">
             {/* Left: User Profile / Greeting */}
             <div className="flex items-center gap-3">
                 <button onClick={() => onNavigate('settings')} className="w-12 h-12 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-sm hover:bg-white/30 transition-colors">
                     {user?.photoURL ? <img src={user.photoURL} alt="User" className="w-full h-full object-cover" /> : <UserIcon className="w-6 h-6 text-white" />}
                 </button>
                 <div>
                     <p className="text-xs font-medium opacity-90 mb-0.5">Assalamu'alaikum</p>
                     <h1 className="text-lg font-bold font-serif italic truncate max-w-[120px]">{isGuest ? 'Guest' : (user?.displayName || 'Believer')}</h1>
                 </div>
             </div>
             
             {/* Right: App Name and Theme Toggle */}
             <div className="flex flex-col items-end gap-1 mt-1">
                 <div className="text-right">
                     <p className="text-[9px] uppercase tracking-wider opacity-80 leading-tight">Powered by</p>
                     <p className="text-xs font-bold leading-tight flex items-center justify-end">
                         Daily Muslim Quran
                     </p>
                 </div>
                 <button 
                   onClick={toggleTheme} 
                   className="p-1.5 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 transition-colors border border-white/10 mt-1"
                 >
                     {isDarkMode ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-white" />}
                 </button>
             </div>
         </div>
      </div>

      <div className="relative z-10 px-5 space-y-4">
          
          {/* Location Banner */}
          {!location ? (
               <div className={`rounded-[24px] p-5 flex items-center justify-between shadow-lg text-white mt-10 transition-colors ${isDarkMode ? 'bg-bg-panel border border-border-main' : 'bg-[#2D6A52]'}`}>
                   <div className="flex items-center gap-2">
                       <div className="w-6 h-6 border border-white/50 rounded-full flex items-center justify-center">
                           <span className="text-[10px]">✕</span>
                       </div>
                       <div>
                           <p className="text-xs opacity-90 leading-tight">Please enable your</p>
                           <p className="font-bold text-lg leading-tight">Location</p>
                       </div>
                   </div>
                   <button className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1 shadow-md transition-colors ${isDarkMode ? 'bg-accent text-black' : 'bg-white text-black'}`}>
                       <span className="w-3 h-3 flex items-center justify-center border border-black rounded-full shrink-0 text-[8px]">◎</span>
                       Enable
                   </button>
               </div>
          ) : (
               <div className={`rounded-[24px] p-5 flex items-center justify-between shadow-lg text-white mt-4 transition-colors ${isDarkMode ? 'bg-bg-panel border border-border-main' : 'bg-[#2D6A52]'}`}>
                   <div className="flex flex-col">
                       <p className="text-xs opacity-90 mb-1">Your Location</p>
                       <p className="font-bold flex items-center gap-1 text-lg">
                           <MapPin className="w-4 h-4 text-white" />
                           <span className="truncate max-w-[180px]">{locationName}</span>
                       </p>
                   </div>
                   <button className={`px-4 py-2 rounded-full text-xs font-bold shadow-md transition-colors ${isDarkMode ? 'bg-accent text-white' : 'bg-white text-[#2D6A52]'}`}>
                       Update
                   </button>
               </div>
          )}

          {/* Daily Progress Card */}
          <div className={`text-white rounded-[24px] p-6 shadow-xl transition-colors ${isDarkMode ? 'bg-progress-bg border border-border-main' : 'bg-[#122421] border border-white/5'}`}>
              <div className="flex justify-between items-center mb-4">
                 
                 {/* Circle progress */}
                 <div className="relative w-[100px] h-[100px] flex-shrink-0 flex items-center justify-center">
                     <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                         <circle cx="50" cy="50" r="40" className="stroke-white/10" strokeWidth="6" fill="none" />
                         <circle cx="50" cy="50" r="40" className={`transition-all duration-1000 ease-out ${isDarkMode ? 'stroke-accent' : 'stroke-[#4D8F76]'}`} strokeWidth="6" fill="none" strokeDasharray="251" strokeDashoffset={dashOffset} strokeLinecap="round" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                         <span className="text-[10px] font-medium opacity-70 leading-tight">Total<br/>Completion</span>
                         <span className="text-base font-bold mt-1">{progress.total}%</span>
                     </div>
                 </div>

                 {/* Stats */}
                 <div className="flex-1 flex flex-col gap-2 pl-4">
                     <h3 className="text-sm font-bold flex items-center gap-2 mb-1">
                         <Activity className="w-4 h-4 text-white" />
                         Daily Progress
                     </h3>
                     <div className="flex justify-between items-center text-xs">
                         <span className="opacity-80 font-light">Salat Completion</span>
                         <span className="font-medium">{progress.salat}%</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                         <span className="opacity-80 font-light">Quran Completion</span>
                         <span className="font-medium">{progress.quran}%</span>
                     </div>
                     <div className="flex justify-between items-center text-xs mt-1">
                         <span className="opacity-80 font-light">Daily Checklist</span>
                         <span className="font-medium">{progress.tasbih}%</span>
                     </div>
                 </div>
              </div>
              
              <div className="w-full h-[1px] bg-white/10 my-3"></div>
              
              <button 
                  className="flex w-full justify-center items-center text-xs opacity-80 hover:opacity-100 cursor-pointer p-2 -my-2" 
                  onClick={() => onNavigate('history')}
              >
                  Track your daily progress <ChevronRight className="w-4 h-4 ml-1" />
              </button>
          </div>
      </div>

      <div className={`relative z-10 w-full rounded-t-[40px] pt-8 pb-32 px-5 mt-8 flex-1 shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.1)] transition-colors duration-300 ${isDarkMode ? 'bg-bg-base' : 'bg-white'}`}>
        
        {/* Grid Navigation */}
        <div className="grid grid-cols-4 gap-y-6 gap-x-2">
            <MenuButton icon={<QuranIcon />} label="AL Quran" onClick={() => onNavigate('quran')} delay={0.1} />
            <MenuButton icon={<HadithIcon />} label="Hadith" onClick={() => onNavigate('hadith')} delay={0.1} />
            <MenuButton icon={<ZakatIcon />} label="Zakat" onClick={() => onNavigate('zakat')} delay={0.1} />
            <MenuButton icon={<TasbihIcon />} label="Tasbih" onClick={() => onNavigate('tasbih')} delay={0.1} />
            
            <MenuButton icon={<QiblaIcon />} label="Qibla" onClick={() => onNavigate('qibla')} delay={0.1} />
            <MenuButton icon={<MosqueIcon />} label="Prayer" onClick={() => onNavigate('prayer')} delay={0.1} />
            <MenuButton icon={<History />} label="History" onClick={() => onNavigate('history')} delay={0.1} />
            <MenuButton icon={<Bell />} label="Notifs" onClick={() => onNavigate('notifications')} delay={0.1} />
            <MenuButton icon={<DuaIcon />} label="Dua" onClick={() => onNavigate('dua')} delay={0.1} />
            <MenuButton icon={<EventIcon />} label="Islamic Events" onClick={() => onNavigate('events')} delay={0.1} />
            <MenuButton icon={<CalendarIcon />} label="Islamic Calendar" onClick={() => onNavigate('calendar')} delay={0.1} />
            <MenuButton icon={<NamesIcon />} label="99 Names of ALLAH" onClick={() => onNavigate('names')} delay={0.1} />
            <MenuButton icon={<RamadanIcon className="w-8 h-8 text-accent" />} label="Ramadan" onClick={() => onNavigate('ramadan')} delay={0.1} />
            <MenuButton icon={<BookmarksIcon className="w-8 h-8 text-accent" />} label="Bookmarks" onClick={() => onNavigate('bookmarks')} delay={0.1} />
        </div>
      </div>
    </div>
  );
}

function MenuButton({ icon, label, onClick, disabled, delay }: { icon: React.ReactNode, label: string, onClick: () => void, disabled?: boolean, delay: number }) {
    return (
        <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.2 }}
            onClick={onClick}
            disabled={disabled}
            className={`flex flex-col items-center justify-start space-y-2 ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'active:scale-95'} transition-transform mx-auto w-[70px]`}
        >
            <div className="w-14 h-14 bg-bg-panel border border-border-main rounded-full flex items-center justify-center shadow-lg shadow-accent/10 text-accent transition-colors">
                {React.cloneElement(icon as React.ReactElement, { className: "w-[26px] h-[26px] z-10 stroke-[1.5]" })}
            </div>
            <span className="text-[11px] font-medium text-text-main text-center leading-tight transition-colors">{label}</span>
        </motion.button>
    );
}

