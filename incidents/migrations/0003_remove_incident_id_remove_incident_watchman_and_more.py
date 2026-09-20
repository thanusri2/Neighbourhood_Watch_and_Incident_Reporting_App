import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('incidents', '0002_incident_watchman'),
        ('users', '0002_alter_user_role_incharge_resident_watchman'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='incident',
            name='id',
        ),
        migrations.RemoveField(
            model_name='incident',
            name='watchman',
        ),
        migrations.RemoveField(
            model_name='incidentcategory',
            name='id',
        ),
        migrations.AddField(
            model_name='incident',
            name='incident_id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AddField(
            model_name='incidentcategory',
            name='category_id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='incident',
            name='description',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='incident',
            name='location',
            field=models.CharField(blank=True, max_length=150),
        ),
        migrations.AlterField(
            model_name='incident',
            name='status',
            field=models.CharField(choices=[('PENDING', 'Pending'), ('ASSIGNED', 'Assigned'), ('UNDER_INVESTIGATION', 'Under Investigation'), ('RESOLVED', 'Resolved'), ('CLOSED', 'Closed')], default='PENDING', max_length=30),
        ),
        migrations.AlterField(
            model_name='incident',
            name='title',
            field=models.CharField(max_length=150),
        ),
        migrations.CreateModel(
            name='Evidence',
            fields=[
                ('evidence_id', models.AutoField(primary_key=True, serialize=False)),
                ('image_path', models.CharField(max_length=255)),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('incident', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='evidence', to='incidents.incident')),
            ],
        ),
        migrations.CreateModel(
            name='IncidentAssignment',
            fields=[
                ('assignment_id', models.AutoField(primary_key=True, serialize=False)),
                ('assigned_date', models.DateTimeField(auto_now_add=True)),
                ('progress', models.IntegerField(default=0)),
                ('assigned_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assigned_incidents', to='users.incharge')),
                ('guard', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assignments', to='users.watchman')),
                ('incident', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assignments', to='incidents.incident')),
            ],
        ),
    ]
