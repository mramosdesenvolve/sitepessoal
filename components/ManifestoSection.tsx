"use client";

import { motion } from "framer-motion";

/**
 * Frase-âncora + introdução curta da home. É a primeira coisa que se lê;
 * o grafo logo abaixo é a mesma frase em forma navegável.
 */
export function ManifestoSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8 pt-12 md:pt-20 pb-8">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="font-serif text-3xl md:text-5xl leading-tight md:leading-tight max-w-3xl"
      >
        Investigo como cultura, tecnologia e aprendizagem produzem novas
        formas de imaginar o mundo.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="mt-6 max-w-xl text-sm md:text-base text-muted leading-relaxed"
      >
        Este site é uma interface de pensamento: um grafo de conceitos que
        conecta pesquisa, currículos, artigos, palestras, softwares e projetos.
        Explore os nós, leia os textos, percorra o que está sendo construído.
      </motion.p>
    </section>
  );
}
