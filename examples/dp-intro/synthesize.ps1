param([Parameter(Mandatory=$true)][string]$EpisodePath)
$ErrorActionPreference = 'Stop'
$dpEpisode = (Resolve-Path -LiteralPath $EpisodePath).Path
python (Join-Path $dpEpisode 'prepare.py') --require
if ($LASTEXITCODE -ne 0) { throw 'Production gate rejected synthesis.' }
Add-Type -AssemblyName System.Speech
Add-Type -ReferencedAssemblies System.Speech -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Speech.Synthesis;
using System.Speech.AudioFormat;
public class DpSpeechMark {
  public double milliseconds;
  public int characterPosition;
  public int characterCount;
  public string text;
}
public static class DpLocalSpeech {
  public static List<DpSpeechMark> Make(string text, string path) {
    var marks = new List<DpSpeechMark>();
    using (var synth = new SpeechSynthesizer()) {
      synth.SelectVoice("Microsoft Huihui Desktop");
      synth.Rate = 0;
      synth.SetOutputToWaveFile(path, new SpeechAudioFormatInfo(16000, AudioBitsPerSample.Sixteen, AudioChannel.Mono));
      synth.SpeakProgress += (sender, e) => marks.Add(new DpSpeechMark { milliseconds=e.AudioPosition.TotalMilliseconds, characterPosition=e.CharacterPosition, characterCount=e.CharacterCount, text=e.Text });
      synth.Speak(text);
      synth.SetOutputToNull();
    }
    return marks;
  }
}
'@
$dpWork = Join-Path $dpEpisode 'work\voice'
New-Item -ItemType Directory -Path $dpWork -Force | Out-Null
$dpSegments = Get-Content -LiteralPath (Join-Path $dpEpisode 'assets\voice-segments.json') -Raw -Encoding UTF8 | ConvertFrom-Json
foreach ($dpSegment in $dpSegments) {
  $dpWav = Join-Path $dpWork ($dpSegment.id + '.wav')
  $dpMarksFile = Join-Path $dpWork ($dpSegment.id + '.json')
  if ((Test-Path -LiteralPath $dpWav) -and (Test-Path -LiteralPath $dpMarksFile)) { continue }
  $dpMarks = [DpLocalSpeech]::Make($dpSegment.spoken, $dpWav)
  ConvertTo-Json -InputObject @($dpMarks.ToArray()) -Depth 4 | Set-Content -LiteralPath $dpMarksFile -Encoding UTF8
  Write-Output ($dpSegment.id + ': synthesized')
}
