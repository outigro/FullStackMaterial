# Tietokannat ja Node.js

## Yleistä tietokannoista

Perinteiset relaatiotietokannat säilövät tietoa taulukkoina, joiden rakenne ja tietokenttien tyypit määritellään skeemassa \(schema\). Kyselyitä tietokantaan tehdään SQL-kielellä. Tunnetuimpia relaatiotietokantoja ovat esim. Oraclen tietokantaratkaisut, MySQL ja sen sisarprojekti MariaDB sekä PostgresSQL.

Uudemmat NoSQL-tietokannat sen sijaan tallentavat dataa tietokantaan esim. arvo-avain -pareina. NoSQL-tietokantojen kokoelmat \(collection\) vastaavat perinteisen relaatiotietokannan taulun käsitettä , mutta niillä ei ole ennalta määrättyä skeemaa eli rakennekuvausta. Tämä mahdollistaa sen, että jokainen tietokantaan syötetty dokumentti \(vrt. rivi\) voi olla erilainen. Tieto tallennetaan JSON tai XML-muodossa, mikä helpottaa tiedon jatkohyödyntämistä sovelluksissa. Tunnetuimpia NoSQL-tietokantoja ovat MongoDB, Cassandra ja Redis.

Yleisesti voidaan sanoa, että kun NoSQL-tietokannan ei tarvitse huolehtia syötetyn tiedon eheydestä \(skeeman puuttuminen\) saadaan vastineeksi suorituskykyä ja käytön joustavuutta. Kehittäjän harteille jää kuitenkin vastuu siitä, että syötettävä tieto on järkevää ja oikeellista kulloisenkiin käyttötarkoitukseen. Sen sijaan relaatiotietokannan vahvuus on tietokannanhallintajärjestelmä, joka virkamiehen tarkkuudella huolehtii siitä, että tauluihin syötetty data vastaa kehittäjän määrittelemää skeemaa.

![Kuva: Tietokantojen suosituimmuustilastoja \(https://db-engines.com/en/ranking\) ](../.gitbook/assets/image%20%287%29.png)

### Paikallinen vai pilveen asennettu tietokanta

Tietokannan voi asentaa joko paikallisesti omalle koneelle tai hyödyntää lukuisia pilvipalveluja, jotka tarjoavat mahdollisuutta tietokannan ajamiseen verkon yli. Pilvipalveluissa etuna on se, että tietokannan käynnistäminen, hallinta ja ylläpito sekä tietoturvasta huolehtiminen on pitkälti palveluntarjoajan murheena. Toisaalta paikallisen asennuksen säätäminen sekä käyttäjän- ja pääsynhallinta voi olla hieman yksinkertaisempaa. 

