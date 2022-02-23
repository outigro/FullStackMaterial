# Autentikointi ja sessioiden hallinta

## Johdanto

Aiemmin olemme toteuttaneet yksinkertaisen sisäänkirjautumislomakkeen. Onnistunut kirjautuminen ohjaa käyttäjän /userpages -sivulle. Mikään ei kuitenkaan estä ketä tahansa kyseisen osoitteen tuntemaa kirjoittamaan osoitetta selaimeen ja siirtymään sinne. Jotta tietoa  käyttäjän onnistuneesta kirjautumisesta voidaan turvallisesta ylläpitää tarvitaan sessioita.

Sessioiden hallinta on keskeinen osa modernien verkkosovellusten toimintaa. HTTP on itsessään tilaton protokolla, eli protokolla ei tiedä pyytääkö haettavaa sivua kirjautunut käyttäjä vaiko joku muu. Näinollen ohjelmoijan tulee välittää ja ylläpitää tietoa onnistuneesta kirjautumisesta sivupyyntöjen välillä. 

### Sessionhallinnan toteuttaminen

Sessioita voidaan toteuttaa useammalla tavalla. Yksi tavanomaisimmista on antaa onnistuneesti kirjautuneelle käyttäjän yksilöivä tunniste evästeeseen, salata sen sisältö ja tallentaa se käyttäjän selaimeen. Evästeet kulkevat sivupyyntöjen mukana palvelimelle, jossa niiden tietoja voidaan tutkia. 

Salattujen evästeiden lukeminen vaatii luonnollisesti salausavaimen tuntemista. Palvelimelle voidaan tallentaa monenkirjavaa tietoa, esimerkiksi ostoskori tai palvelun asetuksia. Palvelimen tiedot liitetään oikeaan käyttäjään selaimesta saatavaan salatun tunnisteen avulla.

![Kuva: Sessionhallinnan vaiheet \(L&#xE4;hde: Medium.com\)](../.gitbook/assets/image%20%2873%29.png)



