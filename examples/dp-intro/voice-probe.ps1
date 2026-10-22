Add-Type -AssemblyName System.Speech
$dpProbeSynth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$dpProbeSynth.GetInstalledVoices() | ForEach-Object { $_.VoiceInfo.Name }
$dpProbeSynth.Dispose()
