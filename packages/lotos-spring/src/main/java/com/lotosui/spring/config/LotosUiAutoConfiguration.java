package com.lotosui.spring.config;

import com.lotosui.spring.contracts.ComponentPropValidator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LotosUiAutoConfiguration {
  @Bean
  public ComponentPropValidator lotosUiPropValidator() {
    return new ComponentPropValidator();
  }
}
