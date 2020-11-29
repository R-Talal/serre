function Ouvert () {
    servos.P2.setAngle(110)
}
function Ferme () {
    servos.P2.setAngle(10)
}
function Partiellement_Ouvert () {
    servos.P2.setAngle(60)
}
input.onButtonPressed(Button.B, function () {
    servos.P0.run(100)
    basic.pause(2000)
    servos.P0.stop()
})
let Temp_totale = 0
let Hum_totale = 0
let Lum_totale = 0
led.enable(false)
let Temperature = 23
let Humidite = 55
let Luminosite = 55
let Delai_entre_Mesures = 1200000
let Nombre_Mesures = 10
let Lumiere_permise = 0
let Temps_en_minutes = 18 * 60
basic.forever(function () {
    dht11_dht22.queryData(
    DHTtype.DHT11,
    DigitalPin.P1,
    true,
    false,
    true
    )
    Lum_totale = 0
    Hum_totale = 0
    Temp_totale = 0
    for (let index = 0; index < Nombre_Mesures; index++) {
        Lum_totale = Lum_totale + Environment.ReadLightIntensity(AnalogPin.P10)
        Temp_totale = Temp_totale + dht11_dht22.readData(dataType.temperature)
        Hum_totale = Humidite + dht11_dht22.readData(dataType.humidity)
    }
    Temperature = Temp_totale / Nombre_Mesures
    Humidite = Hum_totale / Nombre_Mesures
    Luminosite = Lum_totale / Nombre_Mesures
    if (Temps_en_minutes >= 7 * 60 && Temps_en_minutes < 23 * 60) {
        Lumiere_permise = 1
    }
    if (Temperature >= 45) {
        Lumiere_permise = 0
        Ouvert()
        basic.showString("accionne la fan 100%")
        basic.showString("lumiere rouge")
    } else if (Temperature < 45 && Temperature >= 42) {
        Lumiere_permise = 0
        Ouvert()
        basic.showString("accionne la fan 50%")
    } else if (Temperature < 42 && Temperature >= 40) {
        Lumiere_permise = 0
        Ouvert()
        basic.showString("accionne la fan 25%")
    } else if (Temperature < 40 && Temperature >= 38) {
        Lumiere_permise = 0
        Ouvert()
        basic.showString("Pas de fan")
    } else if (Temperature < 38 && Temperature >= 35) {
        Partiellement_Ouvert()
        basic.showString("Pas de fan")
    } else if (Temperature < 35 && Temperature >= 10) {
        Ferme()
        basic.showString("Pas de fan")
    } else if (Temperature < 10) {
        Ferme()
        basic.showString("Pas de fan")
        basic.showString("lumi\\re bleu")
        basic.showString("Son avertissement")
    }
    if (Humidite >= 95) {
        Ouvert()
        basic.showString("lumiere purpre")
    } else if (Humidite < 95 && Humidite >= 90) {
        Partiellement_Ouvert()
        basic.showString("lumiere verte pulse (gradient)")
    } else if (Humidite < 90 && Humidite >= 25) {
        Ferme()
    } else if (Humidite < 25) {
        Lumiere_permise = 0
        Ferme()
        basic.showString("lumiere Jaune")
        basic.showString("Son avertissement")
    }
    basic.pause(Delai_entre_Mesures)
    Temps_en_minutes += Delai_entre_Mesures / 3600000
    Temps_en_minutes = Temps_en_minutes % (24 * 60)
})
