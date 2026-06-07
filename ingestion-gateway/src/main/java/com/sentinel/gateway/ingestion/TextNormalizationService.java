package com.sentinel.gateway.ingestion;

import org.springframework.stereotype.Service;

@Service
public class TextNormalizationService {
    
    public String normalize(String input) {
        if (input == null) return "";
        
        // Basic normalization logic for V1: lowercasing and basic character replacement
        String normalized = input.toLowerCase();
        normalized = normalized.replace("@", "a");
        normalized = normalized.replace("$", "s");
        normalized = normalized.replace("1", "i");
        normalized = normalized.replace("0", "o");
        normalized = normalized.replace("!", "i");
        normalized = normalized.replace("k!ll", "kill"); // more specific replacements
        
        // Remove repeated characters more than 2 times, e.g., heeeello -> heello
        normalized = normalized.replaceAll("(.)\\1{2,}", "$1$1");
        
        return normalized;
    }
}
