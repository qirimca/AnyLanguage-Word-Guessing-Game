#!/usr/bin/env python3
"""
Script to generate Wordle-compatible word lists for Crimean Tatar (or similar languages).

This script reads a morphological dictionary (such as the expanded POS dictionary
provided in ``pos_dict_lat.zip``) and an optional frequency list (CSV/Excel)
containing candidate words with frequency counts.  It then produces two
outputs:

``solutions.txt``
    A list of words to use as the target (hidden) words in the game.  By
    default, the script includes 5‑letter lemmas that are nouns or adjectives
    in the nominative case without possessive or point-of-view suffixes.  If
    a frequency file is provided, the solutions list is sorted by descending
    frequency and truncated to the requested number of words.

``valid_guesses.txt``
    A list of all valid guesses a player may enter.  By default this
    includes every 5‑letter lemma found in the morphological dictionary.
    If a frequency file is provided, any additional 5‑letter entries from
    the frequency list are also included.

The script attempts to be flexible.  You can override the default column
names for the frequency file via command-line arguments and choose how
many solutions to keep.

Example usage::

    python generate_word_lists.py \
        --pos-dict pos_dict_lat.txt \
        --freq-file wordlist_cleared.csv \
        --word-column word \
        --freq-column frequency \
        --top-solutions 10000 \
        --out-dir data/

If no frequency file is supplied, the script simply outputs all qualifying
lemmas as both solutions and valid guesses.

Note:  The morphological dictionary is large (~3 GB when uncompressed).  Make
sure your environment has enough memory to load it, or consider streaming
through the file instead of loading it entirely into memory.
"""

import argparse
import csv
import os
import re
import sys
from typing import Dict, Iterable, List, Optional, Set, Tuple

try:
    import pandas as pd  # type: ignore
except ImportError:
    pd = None  # pandas is optional


def load_pos_dict(filepath: str) -> Dict[str, Set[str]]:
    """Load a morphological dictionary from a tab‑separated file.

    The file is expected to have at least three columns: inflected form,
    lemma, and morphological tags.  Only the lemma and tags are stored.

    Returns a mapping from lemma (lowercase) to a set of tag strings.
    """
    lemma_tags: Dict[str, Set[str]] = {}
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            parts = line.rstrip().split("\t")
            if len(parts) < 3:
                continue
            lemma = parts[1].strip().lower()
            tags = parts[2].strip()
            lemma_tags.setdefault(lemma, set()).add(tags)
    return lemma_tags


def is_valid_word(word: str, pattern: re.Pattern) -> bool:
    """Return True if ``word`` consists solely of allowed characters and
    has length 5.  Adjust the regex as needed for your alphabet.
    """
    return len(word) == 5 and bool(pattern.fullmatch(word))


def is_base_form(tags: str) -> bool:
    """Determine whether a set of morphological tags represents a base form
    suitable for a Wordle solution.

    A base form is defined as a noun (NOUN) or adjective (ADJ) in the
    nominative case (nomn) without possessive or point‑of‑view markers and
    without the proper‑noun marker (prop).
    """
    # Basic checks on presence/absence of markers
    return (
        ("NOUN" in tags or "ADJ" in tags)
        and "nomn" in tags
        and "poss" not in tags
        and "poin" not in tags
        and "prop" not in tags
    )


def load_frequency_list(
    filepath: str,
    word_column: str,
    freq_column: Optional[str] = None,
    sep: str = ",",
) -> List[Tuple[str, Optional[float]]]:
    """Load a frequency list from CSV or Excel.

    Returns a list of tuples ``(word, frequency)``.  If ``freq_column`` is
    None or missing, frequency is returned as ``None``.
    """
    ext = os.path.splitext(filepath)[1].lower()
    data: List[Tuple[str, Optional[float]]] = []
    if ext in {".xls", ".xlsx"}:
        if pd is None:
            raise ImportError("pandas is required to read Excel files")
        df = pd.read_excel(filepath)
        for _, row in df.iterrows():
            word = str(row[word_column]).strip().lower()
            freq = None
            if freq_column and freq_column in row and row[freq_column] is not None:
                try:
                    freq = float(row[freq_column])
                except (ValueError, TypeError):
                    freq = None
            data.append((word, freq))
    else:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            reader = csv.DictReader(f, delimiter=sep)
            for row in reader:
                word = str(row[word_column]).strip().lower()
                freq = None
                if freq_column and freq_column in row and row[freq_column]:
                    try:
                        freq = float(row[freq_column])
                    except ValueError:
                        freq = None
                data.append((word, freq))
    return data


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Wordle word lists.")
    parser.add_argument(
        "--pos-dict",
        required=True,
        help="Path to the unzipped POS dictionary (pos_dict_lat.txt).",
    )
    parser.add_argument(
        "--freq-file",
        help="Optional path to a CSV or Excel file with word frequencies.",
    )
    parser.add_argument(
        "--word-column",
        default="word",
        help="Column name in the frequency file that contains the word.",
    )
    parser.add_argument(
        "--freq-column",
        default=None,
        help="Column name in the frequency file that contains the frequency (optional).",
    )
    parser.add_argument(
        "--top-solutions",
        type=int,
        default=None,
        help="Limit the number of solutions to the top N by frequency (requires freq-file).",
    )
    parser.add_argument(
        "--out-dir",
        default=".",
        help="Directory where output files will be written.",
    )
    args = parser.parse_args()

    # Ensure output directory exists
    os.makedirs(args.out_dir, exist_ok=True)

    # Build regex for valid characters (modify as needed for your alphabet)
    alphabet_chars = "a-zğışçñöüáàâéèêëíìîïóòôöúùûü"
    valid_pattern = re.compile(f"^[{alphabet_chars}]+$", re.IGNORECASE)

    print("Loading POS dictionary...", file=sys.stderr)
    lemma_tags = load_pos_dict(args.pos_dict)
    print(f"Loaded {len(lemma_tags)} lemmas from POS dictionary.", file=sys.stderr)

    # Determine all valid guess words (lemmas only) based solely on the POS dict
    valid_words: Set[str] = set()
    for lemma in lemma_tags:
        if is_valid_word(lemma, valid_pattern):
            valid_words.add(lemma)

    # Solutions will be selected from valid_words based on tags and optionally frequency
    solution_candidates: Set[str] = set()
    for lemma, tags_set in lemma_tags.items():
        if not is_valid_word(lemma, valid_pattern):
            continue
        if any(is_base_form(tags) for tags in tags_set):
            solution_candidates.add(lemma)

    # If a frequency file is provided, load it and sort candidates by frequency
    ordered_solutions: List[str] = []
    if args.freq_file:
        print("Loading frequency file...", file=sys.stderr)
        data = load_frequency_list(args.freq_file, args.word_column, args.freq_column)
        freq_map: Dict[str, float] = {}
        for word, freq in data:
            if freq is None:
                continue
            if word in solution_candidates:
                # Use maximum frequency if word appears multiple times
                freq_map[word] = max(freq_map.get(word, 0.0), freq)
        print(f"Loaded frequencies for {len(freq_map)} words.", file=sys.stderr)
        # Sort by frequency descending
        ordered_solutions = [w for w, _ in sorted(freq_map.items(), key=lambda x: (-x[1], x[0]))]
        # If no frequencies matched, fall back to alphabetical order
        if not ordered_solutions:
            ordered_solutions = sorted(solution_candidates)
    else:
        ordered_solutions = sorted(solution_candidates)

    # Apply top N if specified
    if args.top_solutions is not None and args.top_solutions > 0:
        ordered_solutions = ordered_solutions[: args.top_solutions]

    # Prepare valid guesses list
    valid_list = sorted(valid_words)

    # Write outputs
    solutions_path = os.path.join(args.out_dir, "solutions.txt")
    valid_path = os.path.join(args.out_dir, "valid_guesses.txt")
    with open(solutions_path, "w", encoding="utf-8") as f_sol:
        for w in ordered_solutions:
            f_sol.write(w + "\n")
    with open(valid_path, "w", encoding="utf-8") as f_val:
        for w in valid_list:
            f_val.write(w + "\n")
    print(f"Wrote {len(ordered_solutions)} solutions to {solutions_path}", file=sys.stderr)
    print(f"Wrote {len(valid_list)} valid guesses to {valid_path}", file=sys.stderr)


if __name__ == "__main__":
    main()