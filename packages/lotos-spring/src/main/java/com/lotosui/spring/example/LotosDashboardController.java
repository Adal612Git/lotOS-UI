package com.lotosui.spring.example;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Map;

@Controller
public class LotosDashboardController {
  @GetMapping("/lotos-dashboard")
  public String dashboard(Model model) {
    model.addAttribute("queueColumns", List.of(
        Map.of("key", "ticket", "label", "Ticket"),
        Map.of("key", "owner", "label", "Owner"),
        Map.of("key", "priority", "label", "Priority")
    ));
    model.addAttribute("queueRows", List.of(
        Map.of("ticket", "#A-118", "owner", "Mia", "priority", "High"),
        Map.of("ticket", "#B-204", "owner", "Luis", "priority", "Medium"),
        Map.of("ticket", "#C-331", "owner", "Iris", "priority", "Low")
    ));
    return "examples/dashboard";
  }
}
