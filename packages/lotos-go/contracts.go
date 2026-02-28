package lotosgo

var componentContracts = map[string][]string{
	"button": {"label", "variant", "size", "disabled"},
	"badge":  {"label", "variant"},
	"card":   {"title", "subtitle", "body", "footer"},
	"input":  {"label", "placeholder", "helperText", "errorText"},
	"form":   {"title", "description", "action", "method", "submitLabel", "body"},
	"modal":  {"title", "description", "body", "footer"},
	"table":  {"caption", "columns", "rows", "emptyState"},
}

func HasComponent(name string) bool {
	_, ok := componentContracts[name]
	return ok
}

func AllowedProps(name string) []string {
	return componentContracts[name]
}
