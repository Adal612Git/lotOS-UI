package com.lotosui.spring.contracts;

import java.util.List;
import java.util.Map;

public final class ComponentContractRegistry {
  private static final Map<String, List<String>> CONTRACTS = Map.of(
      "button", List.of("variant", "size", "disabled", "label"),
      "badge", List.of("variant", "label"),
      "card", List.of("title", "subtitle", "body", "footer"),
      "input", List.of("label", "type", "placeholder", "helperText", "errorText"),
      "form", List.of("title", "description", "method", "action", "submitLabel", "body"),
      "modal", List.of("title", "description", "open", "body", "footer"),
      "table", List.of("caption", "columns", "rows", "emptyState")
  );

  private ComponentContractRegistry() {
  }

  public static List<String> getAllowedProps(String component) {
    return CONTRACTS.getOrDefault(component, List.of());
  }

  public static boolean hasComponent(String component) {
    return CONTRACTS.containsKey(component);
  }
}
