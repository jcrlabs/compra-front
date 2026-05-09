{{- define "compra-front.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "compra-front.fullname" -}}
{{- printf "%s" (include "compra-front.name" .) | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "compra-front.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
app.kubernetes.io/name: {{ include "compra-front.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "compra-front.selectorLabels" -}}
app.kubernetes.io/name: {{ include "compra-front.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
