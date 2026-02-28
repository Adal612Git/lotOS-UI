package lotosgo

func ValidateProps(component string, props map[string]any) map[string]any {
	if !HasComponent(component) {
		panic("unknown LotOS UI component: " + component)
	}

	allowed := AllowedProps(component)
	lookup := make(map[string]struct{}, len(allowed))
	for _, key := range allowed {
		lookup[key] = struct{}{}
	}

	sanitized := make(map[string]any)
	for key, value := range props {
		if _, ok := lookup[key]; ok {
			sanitized[key] = value
		}
	}

	return sanitized
}
