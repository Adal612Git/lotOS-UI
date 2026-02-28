package com.lotosui.spring.contracts;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ComponentPropValidator {
  public Map<String, Object> validate(String component, Map<String, Object> props) {
    if (!ComponentContractRegistry.hasComponent(component)) {
      throw new IllegalArgumentException("Unknown LotOS UI component: " + component);
    }

    List<String> allowedProps = ComponentContractRegistry.getAllowedProps(component);
    Map<String, Object> sanitized = new HashMap<>();

    for (Map.Entry<String, Object> entry : props.entrySet()) {
      if (allowedProps.contains(entry.getKey())) {
        sanitized.put(entry.getKey(), entry.getValue());
      }
    }

    return sanitized;
  }
}
