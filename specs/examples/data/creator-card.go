import ../commons.go

CreatorCard {
  _id string<isUnique|indexed>

  title string

  description? string

  slug string<isUnique|indexed>

  creator_reference string<indexed>

  links[]? {
    title string
    url string
  }

  service_rates? {
    currency string

    rates[] {
      name string
      description string
      amount number
    }
  }

  status string<indexed>

  access_type string

  access_code? string

  created number

  updated number

  deleted? number
}