import { useState, useCallback, useRef } from 'react';
import { PhotoEnhancements, PhotoFrameSettings } from '../types';

export interface EditorState {
  scale: number;
  translateX: number;
  translateY: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  enhancements: PhotoEnhancements;
  frame: PhotoFrameSettings;
  backgroundColor: string;
  replaceBgOn: boolean;
  bgSampleColor: { r: number; g: number; b: number } | null;
  bgTolerance: number;
  imageQuality: 'high' | 'medium' | 'low';
}

const initialEditorState: EditorState = {
  scale: 1.0,
  translateX: 0,
  translateY: 0,
  rotation: 0,
  flipH: false,
  flipV: false,
  enhancements: {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 0,
    exposure: 0,
    temperature: 0,
  },
  frame: {
    borderOn: false,
    borderColor: '#000000',
    borderThickness: 2,
    roundedCorners: 0,
    shadowEffect: false,
  },
  backgroundColor: '#FFFFFF', // default transparent/white background preset
  replaceBgOn: false,
  bgSampleColor: null,
  bgTolerance: 30,
  imageQuality: 'high',
};

export function useImageEditor() {
  const [state, setState] = useState<EditorState>(initialEditorState);
  
  // History stacks for Undo / Redo
  const undoStackRef = useRef<EditorState[]>([]);
  const redoStackRef = useRef<EditorState[]>([]);

  // Helper to push new snapshot onto history
  const pushState = useCallback((nextStateOrFunc: EditorState | ((prev: EditorState) => EditorState)) => {
    setState((prev) => {
      const next = typeof nextStateOrFunc === 'function' ? nextStateOrFunc(prev) : nextStateOrFunc;
      
      // Save current state to undo stack before updating
      undoStackRef.current.push(prev);
      // Clear redo stack on new active action
      redoStackRef.current = [];
      
      // Limit history stack size to 20
      if (undoStackRef.current.length > 20) {
        undoStackRef.current.shift();
      }
      
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    if (undoStackRef.current.length === 0) return;
    const previous = undoStackRef.current.pop()!;
    redoStackRef.current.push(state);
    setState(previous);
  }, [state]);

  const redo = useCallback(() => {
    if (redoStackRef.current.length === 0) return;
    const next = redoStackRef.current.pop()!;
    undoStackRef.current.push(state);
    setState(next);
  }, [state]);

  const setScale = useCallback((scale: number) => {
    pushState((prev) => ({ ...prev, scale: Math.max(0.1, Math.min(10, scale)) }));
  }, [pushState]);

  const setTranslate = useCallback((x: number, y: number) => {
    pushState((prev) => ({ ...prev, translateX: x, translateY: y }));
  }, [pushState]);

  const setRotation = useCallback((rotation: number) => {
    // Normalise between -180 and 180 degrees
    let norm = rotation % 360;
    if (norm > 180) norm -= 360;
    if (norm < -180) norm += 360;
    pushState((prev) => ({ ...prev, rotation: norm }));
  }, [pushState]);

  const toggleFlipH = useCallback(() => {
    pushState((prev) => ({ ...prev, flipH: !prev.flipH }));
  }, [pushState]);

  const toggleFlipV = useCallback(() => {
    pushState((prev) => ({ ...prev, flipV: !prev.flipV }));
  }, [pushState]);

  const updateEnhancement = useCallback((key: keyof PhotoEnhancements, value: number) => {
    pushState((prev) => ({
      ...prev,
      enhancements: {
        ...prev.enhancements,
        [key]: value,
      },
    }));
  }, [pushState]);

  const updateFrame = useCallback((key: keyof PhotoFrameSettings, value: any) => {
    pushState((prev) => ({
      ...prev,
      frame: {
        ...prev.frame,
        [key]: value,
      },
    }));
  }, [pushState]);

  const updateStateValue = useCallback((key: keyof EditorState, value: any) => {
    pushState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, [pushState]);

  const resetAll = useCallback(() => {
    pushState(initialEditorState);
  }, [pushState]);

  const resetPosition = useCallback(() => {
    pushState((prev) => ({
      ...prev,
      scale: 1.0,
      translateX: 0,
      translateY: 0,
      rotation: 0,
      flipH: false,
      flipV: false,
    }));
  }, [pushState]);

  const resetEnhancements = useCallback(() => {
    pushState((prev) => ({
      ...prev,
      enhancements: { ...initialEditorState.enhancements },
    }));
  }, [pushState]);

  return {
    state,
    setState,
    setScale,
    setTranslate,
    setRotation,
    toggleFlipH,
    toggleFlipV,
    updateEnhancement,
    updateFrame,
    updateStateValue,
    resetAll,
    resetPosition,
    resetEnhancements,
    undo,
    redo,
    canUndo: undoStackRef.current.length > 0,
    canRedo: redoStackRef.current.length > 0,
  };
}
