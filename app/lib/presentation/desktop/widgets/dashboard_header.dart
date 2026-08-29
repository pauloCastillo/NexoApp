import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class DashboardHeader extends StatelessWidget {
  final String userName;
  final String companyName;

  const DashboardHeader({
    super.key,
    required this.userName,
    this.companyName = '',
  });

  String _greeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final dateStr = DateFormat("EEEE, d 'de' MMMM 'de' yyyy", 'es').format(DateTime.now());
    return Row(
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '${_greeting()}, ${userName.split(' ').first}',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w600,
                color: cs.onSurface,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              companyName.isNotEmpty ? '$companyName · $dateStr' : dateStr,
              style: TextStyle(fontSize: 14, color: cs.onSurfaceVariant),
            ),
          ],
        ),
        const Spacer(),
        CircleAvatar(
          radius: 22,
          backgroundColor: cs.primaryContainer,
          foregroundColor: cs.onPrimaryContainer,
          child: Text(
            userName.isNotEmpty ? userName.substring(0, 2).toUpperCase() : '??',
            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
          ),
        ),
      ],
    );
  }
}
