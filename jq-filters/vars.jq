with_entries(
	select(.value.visibility == "public") 
	| del(.value.visibility) 
	| del(.value.notes) 
	| del(.value.rtype) 
	| del(.value.wtype) 
)