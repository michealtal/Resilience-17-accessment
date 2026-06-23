CreateCreatorCardRequest {
	path /creator-cards
	method POST
  
	body {
	  title string<trim|minLength:3|maxLength:100>
  
	  description? string<maxLength:500>
  
	  slug? string<minLength:5|maxLength:50>
  
	  creator_reference string<length:20>
  
	  links[]? {
		title string<minLength:1|maxLength:100>
		url string<maxLength:200>
	  }
  
	  service_rates? {
		currency string(NGN|USD|GBP|GHS)
  
		rates[] {
		  name string<minLength:3|maxLength:100>
		  description string<maxLength:250>
		  amount number<min:1>
		}
	  }
  
	  status string(draft|published)
  
	  access_type? string(public|private)
  
	  access_code? string<length:6>
	}
  }