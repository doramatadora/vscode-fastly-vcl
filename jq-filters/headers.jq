map(
	select(.visibility == "public") 
	| {
		(.name): ( . | del(.visibility) | del(.name))
	}
) | add
