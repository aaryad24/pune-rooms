import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function ImageGallery({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDialog, setShowDialog] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DialogTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative aspect-video cursor-pointer overflow-hidden rounded-lg"
            >
              <img
                src={images[0]}
                alt="Main"
                className="object-cover w-full h-full"
              />
            </motion.div>
          </DialogTrigger>
          <div className="grid grid-cols-2 gap-4">
            {images.slice(1, 5).map((image, index) => (
              <DialogTrigger key={index} asChild>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                >
                  <img
                    src={image}
                    alt={`Room ${index + 2}`}
                    className="object-cover w-full h-full"
                  />
                  {index === 3 && images.length > 5 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xl font-semibold">
                        +{images.length - 5} more
                      </span>
                    </div>
                  )}
                </motion.div>
              </DialogTrigger>
            ))}
          </div>
        </div>

        <DialogContent className="max-w-4xl">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                alt={`Image ${currentIndex + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full aspect-video object-contain"
              />
            </AnimatePresence>

            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setShowDialog(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
